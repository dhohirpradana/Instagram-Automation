from facebook_scraper import get_posts, get_group_info, get_posts_by_search, set_cookies, set_user_agent
import os
import random
import time

cookies = os.environ.get("COOKIES", "")

if cookies == "":
    print("No cookies found, please set cookies in environment variable")
else:
    # set cookies.json value to cookies
    with open('cookies.json', 'w') as f:
        f.write(cookies)

    time.sleep(2)

user_agents = []

# set chrome user agent
set_user_agent(
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")
set_cookies("cookies.json")
time.sleep(2)

# lawak science
g_ids = [("4021832254535027", "Lawak Science")]
p_ids = [("ProgrammersCreateLife", "I am Programmer,I have no life."),
         ("MemeAndRageComicIndonesia", "Meme & Rage Comic Indonesia")]

fb_type = ["group", "page"]
# random fb_type

# delete file results.txt if exists
if os.path.exists('results.txt'):
    os.remove('results.txt')

rand_fb_type = random.choice(fb_type)
print('rand_fb_type: ', rand_fb_type)

if rand_fb_type == "group":
    g = random.choice(g_ids)
    g_id = g[0]
    g_name = g[1]

    try:
        posts = get_posts(pages=1, options={
                          "posts_per_page": 5, "allow_extra_requests": False}, group=g_id, cookies="cookies.json")

        for i, post in enumerate(posts):
            image = post['image']
            text = post['text']

            # save to txt file
            with open('results.txt', 'a', encoding="utf-8") as f:
                if image:
                    f.write(f"{g_name}||{image}||{text}\n")

            # stop after 10 posts
            if i == 10:
                break
    except Exception as e:
        print(e)

elif rand_fb_type == "page":
    p = random.choice(p_ids)
    p_id = p[0]
    p_name = p[1]

    try:
        posts = get_posts(p_id, pages=1, options={
                          "posts_per_page": 5, "allow_extra_requests": False}, cookies="cookies.json")

        for i, post in enumerate(posts):
            image = post['image']
            text = post['text']

            # save to txt file
            with open('results.txt', 'a', encoding="utf-8") as f:
                if image:
                    f.write(f"{p_name}||{image}||{text}\n")

            # stop after 10 posts
            if i == 10:
                break
    except Exception as e:
        print(e)

elif rand_fb_type == "search":
    search = "science"

    try:
        posts = get_posts_by_search(search, pages=3, options={
                                    "posts_per_page": 5, "allow_extra_requests": False}, cookies="cookies.json")

        for i, post in enumerate(posts):
            image = post['image']
            text = post['text']

            # save to txt file
            with open('results.txt', 'a', encoding="utf-8") as f:
                if image:
                    f.write(f"{search}||{image}||{text}\n")

            # stop after 10 posts
            if i == 10:
                break

        # read results.txt
        # try:
        #     with open('results.txt', 'r', encoding="utf-8") as f:
        #         # print(f.read())
        #         # split by ||
        #         for line in f:
        #             print(line.split("||")[2])
        # except Exception as e:
        #     print(e)

    except Exception as e:
        print(e)
