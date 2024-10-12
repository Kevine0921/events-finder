import subprocess
import datetime
import time
import schedule

def run_scrapers():
    print(f"Starting scrapers at {datetime.datetime.now()}")
    
    # Run luma.py
    print("Running luma.py")
    subprocess.run(["python", "luma.py"], check=True)
    
    # Run meetup.py
    print("Running meetup.py")
    subprocess.run(["python", "meetup.py"], check=True)
    
    print(f"Finished running scrapers at {datetime.datetime.now()}")

if __name__ == "__main__":
    # Schedule the job to run daily at 1:00 AM
    schedule.every().day.at("01:00").do(run_scrapers)
    
    while True:
        schedule.run_pending()
        time.sleep(60)  # Wait for 60 seconds before checking again