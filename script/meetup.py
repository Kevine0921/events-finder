from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
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
    "Thessaloniki": {"latitude": 40.6401, "longitude": 22.9444}
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
            print(f"Selector failed: ")
        except Exception as e:
            print(f"Error with selector")

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
            print(f"Error finding any 'a' tags: ")

    if 'link' not in event or event['link'] is None:
        print("Failed to find any suitable link.")

    # Event title
    try:
        title_elem = event_element.find_element(By.CSS_SELECTOR, 'h2.text-gray7.font-medium.text-base')
        event['title'] = title_elem.text.strip()
    except Exception as e:
        print(f"Error finding event title: ")
        event['title'] = None

    # Group name
    try:
        group_name_elem = event_element.find_element(By.CSS_SELECTOR, 'p.text-gray6')
        event['group_name'] = group_name_elem.text.split('Group name:')[-1].strip()
    except Exception as e:
        event['group_name'] = None


    # Event image
    try:
        img_elem = event_element.find_element(By.CSS_SELECTOR, 'img[decoding="async"][data-nimg="1"]')
        event['image_url'] = get_high_res_image_url(img_elem.get_attribute('src'))
    except Exception as e:
        print(f"Error finding event image: ")
        event['image_url'] = None

    event['city'] = city
    if city in city_coordinates:
        event['latitude'] = city_coordinates[city]['latitude']
        event['longitude'] = city_coordinates[city]['longitude']
    else:
        event['latitude'] = None
        event['longitude'] = None

    return event



from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
import random
import time

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
            if event.get('link'):
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
        "https://www.meetup.com/find/?source=EVENTS&eventType=inPerson&sortField=DATETIME&location=gr--Thessaloniki"
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