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

g_ids = [
    ("himputek", "Himpunan Teknologi 🇮🇩"),
    ("771918063464559", "Shitmeme untuk kebutuhan Wibu"),
    ("224128411252915", "Quotes"),
    ("334775408669390", "Xavier Memes"),
    ("aicomunity", "ChatGPT Experts"),
    ("4021832254535027", "Lawak Science"),
    ("728679554591625", "Shitposting Meme Universe"),
    ("emisid", "Meme Dakwah Kebutuhan Iman"),
    ("1402557743444701", "Hujatan Teknologi Indonesia (HTI)"),
    ("aicomunity", "ChatGPT"),
]
p_ids = [
    ("100063523938184", "The Cosmic Nightmare"),
    ("RandomOPScreenshots", "Random One Piece Screenshots"),
    ("idealistxavier", "Xavier"),
    ("pos.total", "Perkumpulan Orang Santai"),
    ("StatusLucuOfficialPage", "Status Lucu"),
    ("animeme.ngakak.lovers", "Animeme Ngakak Lovers"),
    ("SpongebobSquarepants.137925052968299", "Cerita Konyol Patrick & SpongeBob (FunPage)"),
    ("k.harianmemerandom", "Kesegaran Harian Meme Random"),
    ("KeluhKesahKehidupanBerTeknologi", "Keluh Kesah Kehidupan Ber Teknologi"),
    ("ProgrammersCreateLife", "I am Programmer,I have no life."),
    ("MemeAndRageComicIndonesia", "Meme & Rage Comic Indonesia"),
    ("mtsb.id", "Meme Troll Sepak Bola"),
    ("228102444674369", "Rakyat +62"),
    ("StatusLucuOfficialPage", "Status Lucu"),
    ("SarcasmLol", "Sarcasm"),
    ("jokesvala", "Programmer Jokes"),
    ("hujatotomotifofficial", "Hujatan Otomotif Indonesia Official"),
    ("Bapakheerp", "Dr bpk prof heerp suheerp"),
]

fb_type = ["group", "page"]

# delete file results.txt if exists
if os.path.exists('results.txt'):
    os.remove('results.txt')

# rand group or page
rand_fb_type = random.choice(fb_type)
print('rand_fb_type: ', rand_fb_type)

if rand_fb_type == "group":
    g = random.choice(g_ids)
    g_id = g[0]
    g_name = g[1]

    try:
        posts = get_posts(pages=1, group=g_id, sleep=5)

        for i, post in enumerate(posts):
            image = post['image']
            text = post['text']

            # save to txt file
            with open('results.txt', 'a', encoding="utf-8") as f:
                if image:
                    f.write(f"{g_name}|჻|{image}|჻|{text}ᴣᴣᴣ")

            # stop after 10
            if i == 10:
                break
    except Exception as e:
        print(e)

elif rand_fb_type == "page":
    p = random.choice(p_ids)
    p_id = p[0]
    p_name = p[1]

    try:
        posts = get_posts(p_id, pages=1, sleep=5)

        for i, post in enumerate(posts):
            image = post['image']
            text = post['text']

            # save to txt file
            with open('results.txt', 'a', encoding="utf-8") as f:
                if image:
                    f.write(f"{p_name}|჻|{image}|჻|{text}ᴣᴣᴣ")

            # stop after 10
            if i == 10:
                break
    except Exception as e:
        print(e)

elif rand_fb_type == "search":
    search = "science"

    try:
        posts = get_posts_by_search(search, pages=1, sleep=5)

        for i, post in enumerate(posts):
            image = post['image']
            text = post['text']

            # save to txt file
            with open('results.txt', 'a', encoding="utf-8") as f:
                if image:
                    f.write(f"{search}|჻|{image}|჻|{text}ᴣᴣᴣ")

            # stop after 10
            if i == 10:
                break

    except Exception as e:
        print(e)
