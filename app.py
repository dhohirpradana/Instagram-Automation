from facebook_scraper import get_posts, get_group_info, get_posts_by_search, set_cookies, set_user_agent
import os
import random
import time

cookies = os.environ.get("COOKIES", "")

# set cookies.json value to cookies
with open('cookies.json', 'w') as f:
    f.write(cookies)
    
print("cookies.json created, wait 2 seconds...")
time.sleep(2)

print("Set user agent and cookies, wait 2 seconds...")
# set chrome user agent
set_user_agent(
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")
set_cookies("cookies.json")
time.sleep(2)

# lawak science
g_ids = [("4021832254535027", "Lawak Science")]
p_ids = [("ProgrammersCreateLife", "I am Programmer,I have no life.")]

# group, page, search
fb_type = ["group", "page"]

print("Deleting results.txt...")
# delete file results.txt if exists
if os.path.exists('results.txt'):
    os.remove('results.txt')

print("Starting scraping...")
rand_fb_type = random.choice(fb_type)

if rand_fb_type == "group":
    g = random.choice(g_ids)
    g_id = g[0]
    g_name = g[1]
    
    for i, post in enumerate(get_posts(pages=1, group=g_id, cookies="cookies.json")):
        image = post['image']

        # save to txt file
        with open('results.txt', 'a', encoding="utf-8") as f:
            if image:
                f.write(f"{g_name}||{image}\n")

        # stop after 10 posts
        if i == 10:
            break
        
elif rand_fb_type == "page":
    p = random.choice(p_ids)
    p_id = p[0]
    p_name = p[1]
    
    for i, post in enumerate(get_posts(p_id, pages=1, cookies="cookies.json")):
        image = post['image']

        # save to txt file
        with open('results.txt', 'a', encoding="utf-8") as f:
            if image:
                f.write(f"{p_name}||{image}\n")

        if i == 10:
            break
        
elif rand_fb_type == "search":
    search = "science"
    
    for i, post in enumerate(get_posts_by_search(search, pages=3)):
        image = post['image']

        # save to txt file
        with open('results.txt', 'a', encoding="utf-8") as f:
            if image:
                f.write(f"{search}||{image}\n")

        if i == 10:
            break