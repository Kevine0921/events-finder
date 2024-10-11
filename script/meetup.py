from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import TimeoutException
from datetime import datetime, timedelta
import re
import time
import json
from dateutil import parser as date_parser
import random

def setup_driver():
    chrome_options = Options()
    # chrome_options.add_argument("--headless")  # Uncomment to run in headless mode
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=chrome_options)
    return driver

def extract_city_from_url(url):
    match = re.search(r'location=(\w+)--(\w+)', url)
    if match:
        return match.group(2)
    return None

def get_high_res_image_url(url):
    if url and 'meetupstatic.com' in url:
        url = re.sub(r'\?w=\d+', '', url)
        return f"{url}?w=1920"
    return url


CITY_COORDINATES = {
    "Helsinki": {"latitude": 60.1699, "longitude": 24.9384},
    "Tokyo": {"latitude": 35.6762, "longitude": 139.6503},
    "Bangkok": {"latitude": 13.7563, "longitude": 100.5018},
    "Beijing": {"latitude": 39.9042, "longitude": 116.4074},
    "NewDelhi": {"latitude": 28.6139, "longitude": 77.2090},
    "Jakarta": {"latitude": -6.2088, "longitude": 106.8456},
    "KualaLumpur": {"latitude": 3.1390, "longitude": 101.6869},
    "Manila": {"latitude": 14.5995, "longitude": 120.9842},
    "Doha": {"latitude": 25.2854, "longitude": 51.5310},
    "Riyadh": {"latitude": 24.7136, "longitude": 46.6753},
    "Singapore": {"latitude": 1.3521, "longitude": 103.8198},
    "Colombo": {"latitude": 6.9271, "longitude": 79.8612},
    "Taipei": {"latitude": 25.0330, "longitude": 121.5654},
    "Ankara": {"latitude": 39.9334, "longitude": 32.8597},
    "AbuDhabi": {"latitude": 24.4539, "longitude": 54.3773},
    "Canberra": {"latitude": -35.2809, "longitude": 149.1300},
    "Wellington": {"latitude": -41.2924, "longitude": 174.7787},
    "NewYork": {"latitude": 40.7128, "longitude": -74.0060},
    "LosAngeles": {"latitude": 34.0522, "longitude": -118.2437},
    "Chicago": {"latitude": 41.8781, "longitude": -87.6298},
    "Houston": {"latitude": 29.7604, "longitude": -95.3698},
    "Phoenix": {"latitude": 33.4484, "longitude": -112.0740},
    "Philadelphia": {"latitude": 39.9526, "longitude": -75.1652},
    "SanAntonio": {"latitude": 29.4241, "longitude": -98.4936},
    "SanDiego": {"latitude": 32.7157, "longitude": -117.1611},
    "Dallas": {"latitude": 32.7767, "longitude": -96.7970},
    "SanJose": {"latitude": 37.3382, "longitude": -121.8863},
    "Austin": {"latitude": 30.2672, "longitude": -97.7431},
    "Jacksonville": {"latitude": 30.3322, "longitude": -81.6557},
    "SanFrancisco": {"latitude": 37.7749, "longitude": -122.4194},
    "Indianapolis": {"latitude": 39.7684, "longitude": -86.1581},
    "Columbus": {"latitude": 39.9612, "longitude": -82.9988},
    "FortWorth": {"latitude": 32.7555, "longitude": -97.3308},
    "Charlotte": {"latitude": 35.2271, "longitude": -80.8431},
    "Seattle": {"latitude": 47.6062, "longitude": -122.3321},
    "Denver": {"latitude": 39.7392, "longitude": -104.9903},
    "Washington": {"latitude": 38.9072, "longitude": -77.0369},
    "Toronto": {"latitude": 43.6532, "longitude": -79.3832},
    "Montreal": {"latitude": 45.5017, "longitude": -73.5673},
    "Vancouver": {"latitude": 49.2827, "longitude": -123.1207},
    "Calgary": {"latitude": 51.0447, "longitude": -114.0719},
    "Edmonton": {"latitude": 53.5461, "longitude": -113.4938},
    "Ottawa": {"latitude": 45.4215, "longitude": -75.6972},
    "Winnipeg": {"latitude": 49.8951, "longitude": -97.1384},
    "Quebec": {"latitude": 46.8139, "longitude": -71.2080},
    "Hamilton": {"latitude": 43.2557, "longitude": -79.8711},
    "Kitchener": {"latitude": 43.4516, "longitude": -80.4925},
    "London": {"latitude": 42.9849, "longitude": -81.2453},
    "Victoria": {"latitude": 48.4284, "longitude": -123.3656},
    "Halifax": {"latitude": 44.6488, "longitude": -63.5752},
    "Oshawa": {"latitude": 43.8971, "longitude": -78.8658},
    "Windsor": {"latitude": 42.3149, "longitude": -83.0364},
    "Saskatoon": {"latitude": 52.1332, "longitude": -106.6700},
    "Regina": {"latitude": 50.4452, "longitude": -104.6189},
    "St.Johns": {"latitude": 47.5615, "longitude": -52.7126},
    "Kelowna": {"latitude": 49.8880, "longitude": -119.4960},
    "Barrie": {"latitude": 44.3894, "longitude": -79.6903},
    "Munich": {"latitude": 48.1351, "longitude": 11.5820},
    "Hamburg": {"latitude": 53.5511, "longitude": 9.9937},
    "Lyon": {"latitude": 45.7640, "longitude": 4.8357},
    "Marseille": {"latitude": 43.2965, "longitude": 5.3698},
    "Milan": {"latitude": 45.4642, "longitude": 9.1900},
    "Naples": {"latitude": 40.8518, "longitude": 14.2681},
    "Barcelona": {"latitude": 41.3851, "longitude": 2.1734},
    "Valencia": {"latitude": 39.4699, "longitude": -0.3763},
    "Rotterdam": {"latitude": 51.9244, "longitude": 4.4777},
    "Krakow": {"latitude": 50.0647, "longitude": 19.9450},
    "Gothenburg": {"latitude": 57.7089, "longitude": 11.9746},
    "Antwerp": {"latitude": 51.2194, "longitude": 4.4025},
    "Graz": {"latitude": 47.0707, "longitude": 15.4395},
    "Brno": {"latitude": 49.1951, "longitude": 16.6068},
    "Porto": {"latitude": 41.1579, "longitude": -8.6291},
    "Cork": {"latitude": 51.8985, "longitude": -8.4756},
    "Tampere": {"latitude": 61.4978, "longitude": 23.7610},
    "Aarhus": {"latitude": 56.1629, "longitude": 10.2039},
    "Cluj-Napoca": {"latitude": 46.7712, "longitude": 23.6236},
    "Thessaloniki": {"latitude": 40.6401, "longitude": 22.9444},
     "MexicoCity": {"latitude": 19.4326, "longitude": -99.1332},
    "SaoPaulo": {"latitude": -23.5505, "longitude": -46.6333},
    "BuenosAires": {"latitude": -34.6037, "longitude": -58.3816},
    "Bogota": {"latitude": 4.7110, "longitude": -74.0721},
    "Lima": {"latitude": -12.0464, "longitude": -77.0428},
    "Santiago": {"latitude": -33.4489, "longitude": -70.6693},
    "Guayaquil": {"latitude": -2.1894, "longitude": -79.8891},
    "GuatemalaCity": {"latitude": 14.6349, "longitude": -90.5069},
    "Havana": {"latitude": 23.1136, "longitude": -82.3666},
    "SantoDomingo": {"latitude": 18.4861, "longitude": -69.9312},
    "Tegucigalpa": {"latitude": 14.0723, "longitude": -87.1921},
    "LaPaz": {"latitude": -16.4897, "longitude": -68.1193},
    "SanSalvador": {"latitude": 13.6929, "longitude": -89.2182},
    "Managua": {"latitude": 12.1149, "longitude": -86.2362},
    "SanJose": {"latitude": 9.9281, "longitude": -84.0907},
    "PanamaCity": {"latitude": 8.9824, "longitude": -79.5199},
    "Montevideo": {"latitude": -34.9011, "longitude": -56.1645},
    "Asuncion": {"latitude": -25.2867, "longitude": -57.3333},
    "PortofSpain": {"latitude": 10.6596, "longitude": -61.5155},
    "Kingston": {"latitude": 18.0179, "longitude": -76.8099},
    "Guadalajara": {"latitude": 20.6597, "longitude": -103.3496},
    "RiodeJaneiro": {"latitude": -22.9068, "longitude": -43.1729},
    "Cordoba": {"latitude": -31.4201, "longitude": -64.1888},
    "Medellin": {"latitude": 6.2476, "longitude": -75.5709},
    "Arequipa": {"latitude": -16.4090, "longitude": -71.5375},
    "Valparaiso": {"latitude": -33.0472, "longitude": -71.6127},
    "Quito": {"latitude": -0.1807, "longitude": -78.4678},
    "Caracas": {"latitude": 10.4806, "longitude": -66.9036},
    "SanJuan": {"latitude": 18.4655, "longitude": -66.1057},
    "PortauPrince": {"latitude": 18.5944, "longitude": -72.3074},
    "SantaCruz": {"latitude": -17.8146, "longitude": -63.1561},
    "CiudaddelEste": {"latitude": -25.5097, "longitude": -54.6767},
    "Salto": {"latitude": -31.3833, "longitude": -57.9667},
    "Paramaribo": {"latitude": 5.8520, "longitude": -55.2038},
    "Georgetown": {"latitude": 6.8013, "longitude": -58.1551},
    "BelmopanCity": {"latitude": 17.2514, "longitude": -88.7713},
    "Bridgetown": {"latitude": 13.1132, "longitude": -59.5988},
    "Nassau": {"latitude": 25.0480, "longitude": -77.3554},
    "Castries": {"latitude": 14.0101, "longitude": -60.9875},
    "Kingstown": {"latitude": 13.1587, "longitude": -61.2248},
     "Boston": {"latitude": 42.3601, "longitude": -71.0589},
    "Detroit": {"latitude": 42.3314, "longitude": -83.0458},
    "Atlanta": {"latitude": 33.7490, "longitude": -84.3880},
    "Miami": {"latitude": 25.7617, "longitude": -80.1918},
    "Minneapolis": {"latitude": 44.9778, "longitude": -93.2650},
    "Cleveland": {"latitude": 41.4993, "longitude": -81.6944},
    "Orlando": {"latitude": 28.5383, "longitude": -81.3792},
    "SanAntonio": {"latitude": 29.4241, "longitude": -98.4936},
    "Pittsburgh": {"latitude": 40.4406, "longitude": -79.9959},
    "Cincinnati": {"latitude": 39.1031, "longitude": -84.5120},
    "LasVegas": {"latitude": 36.1699, "longitude": -115.1398},
    "KansasCity": {"latitude": 39.0997, "longitude": -94.5786},
    "Portland": {"latitude": 45.5152, "longitude": -122.6784},
    "Nashville": {"latitude": 36.1627, "longitude": -86.7816},
    "Milwaukee": {"latitude": 43.0389, "longitude": -87.9065},
    "Raleigh": {"latitude": 35.7796, "longitude": -78.6382},
    "StLouis": {"latitude": 38.6270, "longitude": -90.1994},
    "NewOrleans": {"latitude": 29.9511, "longitude": -90.0715},
    "SaltLakeCity": {"latitude": 40.7608, "longitude": -111.8910},
    "Hartford": {"latitude": 41.7658, "longitude": -72.6734},
    "Mississauga": {"latitude": 43.5890, "longitude": -79.6441},
    "Brampton": {"latitude": 43.7315, "longitude": -79.7624},
    "Surrey": {"latitude": 49.1913, "longitude": -122.8490},
    "Laval": {"latitude": 45.5617, "longitude": -73.7230},
    "Burnaby": {"latitude": 49.2488, "longitude": -122.9805},
    "Richmond": {"latitude": 49.1666, "longitude": -123.1336},
    "Markham": {"latitude": 43.8561, "longitude": -79.3370},
    "Vaughan": {"latitude": 43.8563, "longitude": -79.5085},
    "Gatineau": {"latitude": 45.4765, "longitude": -75.7013},
    "Longueuil": {"latitude": 45.5308, "longitude": -73.5139},
    "Sherbrooke": {"latitude": 45.4042, "longitude": -71.8929},
    "Saguenay": {"latitude": 48.4279, "longitude": -71.0680},
    "Lévis": {"latitude": 46.8032, "longitude": -71.1780},
    "Kelowna": {"latitude": 49.8880, "longitude": -119.4960},
    "Abbotsford": {"latitude": 49.0504, "longitude": -122.3045},
    "Coquitlam": {"latitude": 49.2838, "longitude": -122.7932},
    "TroisRivières": {"latitude": 46.3432, "longitude": -72.5430},
    "Guelph": {"latitude": 43.5448, "longitude": -80.2482},
    "Cambridge": {"latitude": 43.3616, "longitude": -80.3144},
    "Whitby": {"latitude": 43.8975, "longitude": -78.9429},
    "Vienna": {"latitude": 48.2082, "longitude": 16.3738},
    "Brussels": {"latitude": 50.8503, "longitude": 4.3517},
    "Sofia": {"latitude": 42.6977, "longitude": 23.3219},
    "Zagreb": {"latitude": 45.8150, "longitude": 15.9819},
    "Prague": {"latitude": 50.0755, "longitude": 14.4378},
    "Copenhagen": {"latitude": 55.6761, "longitude": 12.5683},
    "Tallinn": {"latitude": 59.4370, "longitude": 24.7536},
    "Paris": {"latitude": 48.8566, "longitude": 2.3522},
    "Berlin": {"latitude": 52.5200, "longitude": 13.4050},
    "Athens": {"latitude": 37.9838, "longitude": 23.7275},
    "Budapest": {"latitude": 47.4979, "longitude": 19.0402},
    "Dublin": {"latitude": 53.3498, "longitude": -6.2603},
    "Rome": {"latitude": 41.9028, "longitude": 12.4964},
    "Riga": {"latitude": 56.9496, "longitude": 24.1052},
    "Vilnius": {"latitude": 54.6872, "longitude": 25.2797},
    "Luxembourg": {"latitude": 49.6116, "longitude": 6.1319},
    "Valletta": {"latitude": 35.8989, "longitude": 14.5146},
    "Amsterdam": {"latitude": 52.3676, "longitude": 4.9041},
    "Warsaw": {"latitude": 52.2297, "longitude": 21.0122},
    "Lisbon": {"latitude": 38.7223, "longitude": -9.1393},
    "Bucharest": {"latitude": 44.4268, "longitude": 26.1025},
    "Bratislava": {"latitude": 48.1486, "longitude": 17.1077},
    "Ljubljana": {"latitude": 46.0569, "longitude": 14.5058},
    "Madrid": {"latitude": 40.4168, "longitude": -3.7038},
    "Stockholm": {"latitude": 59.3293, "longitude": 18.0686},
    "London": {"latitude": 51.5074, "longitude": -0.1278},
    "Reykjavik": {"latitude": 64.1265, "longitude": -21.8174},
    "Oslo": {"latitude": 59.9139, "longitude": 10.7522},
    "Bern": {"latitude": 46.9480, "longitude": 7.4474},
    "Belgrade": {"latitude": 44.7866, "longitude": 20.4489}
}

def parse_meetup_event(event_element, city, city_coordinates):
    event = {}

    # Event link
    link_selectors = [
        'div.w-full.overflow-hidden > a.w-full.cursor-pointer.hover\\:no-underline',
        'a.w-full.cursor-pointer.hover\\:no-underline',
        'a[data-event-label="Event card"]',
        'a[id="event-card-in-search-results"]'
    ]

    for selector in link_selectors:
        try:
            event_link = event_element.find_element(By.CSS_SELECTOR, selector)
            href = event_link.get_attribute('href')
            if href:
                event['link'] = href
                break
            else:
                print(f"Found element with selector but href is empty")
        except NoSuchElementException:
            print(f"Selector failed: {selector}")
        except Exception as e:
            print(f"Error with selector {selector}: {str(e)}")

    if 'link' not in event or event['link'] is None:
        print("Failed to find link with all selectors. Trying to find any 'a' tag.")
        try:
            all_links = event_element.find_elements(By.TAG_NAME, 'a')
            for link in all_links:
                href = link.get_attribute('href')
                if href and 'events' in href:
                    event['link'] = href
                    print(f"Found link in 'a' tag: {href}")
                    break
        except Exception as e:
            print(f"Error finding any 'a' tags: {str(e)}")

    if 'link' not in event or event['link'] is None:
        print("Failed to find any suitable link.")

    # Event title
    try:
        title_elem = event_element.find_element(By.CSS_SELECTOR, 'h2.text-gray7.font-medium.text-base')
        event['title'] = title_elem.text.strip()
    except Exception as e:
        print(f"Error finding event title: {str(e)}")
        event['title'] = None

    # Group name
    try:
        group_name_elem = event_element.find_element(By.CSS_SELECTOR, 'p.text-gray6')
        event['group_name'] = group_name_elem.text.split('Group name:')[-1].strip()
    except Exception as e:
        event['group_name'] = None

    # Event date
    try:
        time_elem = event_element.find_element(By.CSS_SELECTOR, 'time')
        datetime_str = time_elem.get_attribute('datetime')
        # Remove the timezone identifier in square brackets
        datetime_str = datetime_str.split('[')[0]
        event_datetime = datetime.fromisoformat(datetime_str)
        # Convert datetime to ISO format string
        event['date'] = event_datetime.isoformat()
    except Exception as e:
        print(f"Error finding event date: {str(e)}")
        event['date'] = None

    # Event image
    try:
        img_elem = event_element.find_element(By.CSS_SELECTOR, 'img[decoding="async"][data-nimg="1"]')
        event['image_url'] = get_high_res_image_url(img_elem.get_attribute('src'))
    except Exception as e:
        print(f"Error finding event image: {str(e)}")
        event['image_url'] = None

    event['city'] = city
    if city in city_coordinates:
        event['latitude'] = city_coordinates[city]['latitude']
        event['longitude'] = city_coordinates[city]['longitude']
    else:
        event['latitude'] = None
        event['longitude'] = None

    return event




def scrape_meetup_events(url, driver, city_coordinates):
    city = extract_city_from_url(url)
    driver.get(url)
    
    try:
        # Wait for the events to load
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'div.flex.h-full.break-words'))
        )
    except TimeoutException:
        print(f"Timeout occurred while loading events for URL: {url}. Skipping this URL.")
        return []  # Return an empty list to indicate no events were scraped
    
    events = []
    event_count = 0
    max_events = random.randint(20, 30)  # Limit to 20-30 events

    while event_count < max_events:
        event_cards = driver.find_elements(By.CSS_SELECTOR, 'div.flex.h-full.break-words')
        
        for card in event_cards[event_count:]:
            if event_count >= max_events:
                break
            event = parse_meetup_event(card, city, city_coordinates)
            if event.get('link') and event.get('date'):
                events.append(event)
                event_count += 1

        if event_count >= max_events:
            break

        # Scroll to load more events if needed
        last_height = driver.execute_script("return document.body.scrollHeight")
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)  # Wait for page to load
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break  # No more new events loaded

    return events

def main():
    urls = [
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=fi--Helsinki",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=jp--Tokyo",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=th--Bangkok",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=cn--Beijing",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=in--NewDelhi",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=id--Jakarta",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=my--Kuala Lumpur",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ph--Manila",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=qa--Doha",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=sa--Riyadh",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=sg--Singapore",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=lk--Colombo",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=tw--Taipei",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=tr--Ankara",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ae--AbuDhabi",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=au--Canberra",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=nz--Wellington",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--NewYork",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--LosAngeles",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Chicago",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Houston",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Phoenix",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Philadelphia",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--SanAntonio",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--SanDiego",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Dallas",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--SanJose",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Austin",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Jacksonville",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--SanFrancisco",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Indianapolis",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Columbus",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--FortWorth",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Charlotte",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Seattle",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Denver",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Washington",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Toronto",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Montreal",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Vancouver",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Calgary",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Edmonton",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Ottawa",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Winnipeg",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Quebec",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Hamilton",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Kitchener",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--qc--Qu%C3%A9bec",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Victoria",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Halifax",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Oshawa",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Windsor",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Saskatoon",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Regina",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--St.Johns",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Kelowna",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Barrie",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=de--Munich",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=de--Hamburg",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=fr--Lyon",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=fr--Marseille",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=it--Milan",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=it--Naples",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=es--Barcelona",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=es--Valencia",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=nl--Rotterdam",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=pl--Krakow",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=se--Gothenburg",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=be--Antwerp",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=at--Graz",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=cz--Brno",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=pt--Porto",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ie--Cork",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=fi--Tampere",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=dk--Aarhus",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ro--Cluj-Napoca",
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=gr--Thessaloniki",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=mx--MexicoCity",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=br--SaoPaulo",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ar--BuenosAires",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=co--Bogota",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=pe--Lima",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=cl--Santiago",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ec--Guayaquil",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=gt--GuatemalaCity",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=cu--Havana",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=do--SantoDomingo",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=hn--Tegucigalpa",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=bo--LaPaz",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=sv--SanSalvador",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ni--Managua",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=cr--SanJose",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=pa--PanamaCity",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=uy--Montevideo",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=py--Asuncion",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=tt--PortofSpain",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=jm--Kingston",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=mx--Guadalajara",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=br--RiodeJaneiro",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ar--Cordoba",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=co--Medellin",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=pe--Arequipa",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=cl--Valparaiso",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ec--Quito",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ve--Caracas",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=pr--SanJuan",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ht--PortauPrince",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=bo--SantaCruz",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=py--CiudaddelEste",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=uy--Salto",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=sr--Paramaribo",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=gy--Georgetown",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=bz--BelmopanCity",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=bb--Bridgetown",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=bs--Nassau",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=lc--Castries",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=vc--Kingstown",
     "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Boston",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Detroit",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Atlanta",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Miami",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Minneapolis",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Cleveland",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Orlando",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--SanAntonio",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Pittsburgh",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Cincinnati",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--LasVegas",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--KansasCity",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Portland",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Nashville",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Milwaukee",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Raleigh",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--StLouis",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--NewOrleans",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--SaltLakeCity",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=us--Hartford",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Mississauga",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Brampton",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Surrey",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Laval",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Burnaby",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Richmond",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Markham",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Vaughan",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Gatineau",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Longueuil",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Sherbrooke",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Saguenay",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Lévis",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Kelowna",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Abbotsford",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Coquitlam",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--TroisRivières",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Guelph",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Cambridge",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ca--Whitby",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=at--Vienna",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=be--Brussels",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=bg--Sofia",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=hr--Zagreb",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=cz--Prague",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=dk--Copenhagen",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ee--Tallinn",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=fr--Paris",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=de--Berlin",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=gr--Athens",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=hu--Budapest",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ie--Dublin",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=it--Rome",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=lv--Riga",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=lt--Vilnius",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=lu--Luxembourg",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=mt--Valletta",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=nl--Amsterdam",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=pl--Warsaw",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=pt--Lisbon",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ro--Bucharest",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=sk--Bratislava",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=si--Ljubljana",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=es--Madrid",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=se--Stockholm",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=gb--London",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=is--Reykjavik",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=no--Oslo",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=ch--Bern",
    "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=rs--Belgrade"
]
    
    all_events = []
    
    driver = setup_driver()
    try:
        for url in urls:
            events = scrape_meetup_events(url, driver, CITY_COORDINATES)
            all_events.extend(events)
    finally:
        driver.quit()
    
    filename = "meetup_events.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(all_events, f, ensure_ascii=False, indent=4)
    
    print(f"\nScraped {len(all_events)} events and saved to {filename}")

if __name__ == "__main__":
    main()