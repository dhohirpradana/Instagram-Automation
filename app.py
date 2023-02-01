from facebook_scraper import get_posts, get_group_info, get_posts_by_search
import os
import random

# lawak science
g_ids = [("4021832254535027", "Lawak Science")]
p_ids = [("ProgrammersCreateLife", "I am Programmer,I have no life.")]

fb_type = ["group", "page"]
# random fb_type

# delete file results.txt if exists
if os.path.exists('results.txt'):
    os.remove('results.txt')

rand_fb_type = random.choice(fb_type)

if rand_fb_type == "group":
    g = random.choice(g_ids)
    g_id = g[0]
    g_name = g[1]
    
    for i, post in enumerate(get_posts(pages=3, group=g_id)):
        image = post['image']
        # text = post['text']
        # print(post['text'][:50])

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
    
    for i, post in enumerate(get_posts(pages=3, page=p_id)):
        image = post['image']
        # text = post['text']
        # print(post['text'][:50])

        # save to txt file
        with open('results.txt', 'a', encoding="utf-8") as f:
            if image:
                f.write(f"{p_name}||{image}\n")

        # stop after 10 posts
        if i == 10:
            break
        
elif rand_fb_type == "search":
    search = "science"
    
    for i, post in enumerate(get_posts_by_search(search, pages=3)):
        image = post['image']
        # text = post['text']
        # print(post['text'][:50])

        # save to txt file
        with open('results.txt', 'a', encoding="utf-8") as f:
            if image:
                f.write(f"{search}||{image}\n")

        # stop after 10 posts
        if i == 10:
            break
    

# read results.txt
# with open('results.txt', 'r', encoding="utf-8") as f:
#     # print(f.read())
#     # split by {text: and image: }
#     for line in f.read().split("{text: '"):
#         print(line.split("', image: '"))
