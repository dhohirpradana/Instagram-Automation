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
    ("himputek", "Himpunan Teknologi 🇮🇩", "#memeteknologi #teknologi #hujatanteknologi #paytren #teknologilucu #paytreninaja #aplikasi #bisnis #lowongankerja #viral #iburumahtangga #sedekah #inovasi #bisnissyariah #paymentdigital #suksesberjamaah #paytrenmudah #paytrencerdas #testimonipaytren #lagihits #lowker #infoloker #exploreindonesia #yukngaji #temansetiabayarbayar #pekerja #paytrenindonesia #jamannow #buruhpabrik #paytrenkeren"),
    ("771918063464559", "Shitmeme untuk kebutuhan Wibu", "#meme #lucu #dagelan #indonesia #l4l #viral #motivasi #ngakak #girl #ngakakkocak #hijab #kocak #islam #videolucu #reminder #lucubanget #man #lucuabis #negeriakhirat #jakarta #muhasabah #love #jalan2man #hits #ikhwan #lfl #dakwah #cantik #tausiyah #kekinian"),
    ("224128411252915", "Quotes", "#quotes #katakata #indonesia #quotesoftheday #katabijak #photography #instagood #instagram #quotesindonesia #love #katamutiara #quotestags #quote #quoted #indonesian #quoteoftheday #quoteislami #lfl #nisasabyan #photooftheday #quoteislam #motivation #quotesindo #instadaily #quotedaily #travel #batikpremium #bali #like4like #sajak"),
    ("334775408669390", "Xavier Memes", "#meme #lucu #dagelan #indonesia #l4l #viral #motivasi #ngakak #girl #ngakakkocak #hijab #kocak #islam #videolucu #reminder #lucubanget #man #lucuabis #negeriakhirat #jakarta #muhasabah #love #jalan2man #hits #ikhwan #lfl #dakwah #cantik #tausiyah #kekinian"),
    ("aicomunity", "ChatGPT Experts", "#chatgpt #chatbot #openai #machinelearning #chatwithlenna #aibot #onlineshopping #letstalkaboutit #garagaragempi #chatbotindonesia #adminbutuhliburan #tanyakelenna #lennaid #chatbotindo #startuplife #onlineshop #layananchatbot #gajiumr #bisnisdenganteknologi #voicecommand #repost #lennaasistenpintar #startupindonesia #locationunknown #honne #dramaolshop #adminolshop #textcommand"),
    ("4021832254535027", "Lawak Science", "#meme #lucu #dagelan #indonesia #l4l #viral #motivasi #ngakak #girl #ngakakkocak #hijab #kocak #islam #videolucu #reminder #lucubanget #man #lucuabis #negeriakhirat #jakarta #muhasabah #love #jalan2man #hits #ikhwan #lfl #dakwah #cantik #tausiyah #kekinian"),
    ("728679554591625", "Shitposting Meme Universe", "#meme #lucu #dagelan #indonesia #l4l #viral #motivasi #ngakak #girl #ngakakkocak #hijab #kocak #islam #videolucu #reminder #lucubanget #man #lucuabis #negeriakhirat #jakarta #muhasabah #love #jalan2man #hits #ikhwan #lfl #dakwah #cantik #tausiyah #kekinian"),
    ("emisid", "Meme Dakwah Kebutuhan Iman", "#meme #lucu #dagelan #indonesia #l4l #viral #motivasi #ngakak #girl #ngakakkocak #hijab #kocak #islam #videolucu #reminder #lucubanget #man #lucuabis #negeriakhirat #jakarta #muhasabah #love #jalan2man #hits #ikhwan #lfl #dakwah #cantik #tausiyah #kekinian"),
    ("1402557743444701", "Hujatan Teknologi Indonesia (HTI)", "#memeteknologi #teknologi #hujatanteknologi #paytren #teknologilucu #paytreninaja #aplikasi #bisnis #lowongankerja #viral #iburumahtangga #sedekah #inovasi #bisnissyariah #paymentdigital #suksesberjamaah #paytrenmudah #paytrencerdas #testimonipaytren #lagihits #lowker #infoloker #exploreindonesia #yukngaji #temansetiabayarbayar #pekerja #paytrenindonesia #jamannow #buruhpabrik #paytrenkeren"),
    ("aicomunity", "ChatGPT", "#chatgpt #chatbot #openai #machinelearning #chatwithlenna #aibot #onlineshopping #letstalkaboutit #garagaragempi #chatbotindonesia #adminbutuhliburan #tanyakelenna #lennaid #chatbotindo #startuplife #onlineshop #layananchatbot #gajiumr #bisnisdenganteknologi #voicecommand #repost #lennaasistenpintar #startupindonesia #locationunknown #honne #dramaolshop #adminolshop #textcommand"),
]
p_ids = [
    ("100063523938184", "The Cosmic Nightmare", "#meme #lucu #dagelan #indonesia #l4l #viral #motivasi #ngakak #girl #ngakakkocak #hijab #kocak #islam #videolucu #reminder #lucubanget #man #lucuabis #negeriakhirat #jakarta #muhasabah #love #jalan2man #hits #ikhwan #lfl #dakwah #cantik #tausiyah #kekinian"),
    ("RandomOPScreenshots", "Random One Piece Screenshots", "#onepiece #anime #onepieceindonesia #swimwear #art #manga #bikini #otaku #bali #naruto #luffy #japan #photography #beach #sasuke #love #boruto #oplovers #model #sakura #travel #borutouzumaki #instagood #drawing #islandlife #tokyoghoul #like4like #onepieceanime #summer #casesamsung"),
    ("idealistxavier", "Xavier", "#meme #lucu #dagelan #indonesia #l4l #viral #motivasi #ngakak #girl #ngakakkocak #hijab #kocak #islam #videolucu #reminder #lucubanget #man #lucuabis #negeriakhirat #jakarta #muhasabah #love #jalan2man #hits #ikhwan #lfl #dakwah #cantik #tausiyah #kekinian"),
    ("pos.total", "Perkumpulan Orang Santai", "#meme #lucu #dagelan #indonesia #l4l #viral #motivasi #ngakak #girl #ngakakkocak #hijab #kocak #islam #videolucu #reminder #lucubanget #man #lucuabis #negeriakhirat #jakarta #muhasabah #love #jalan2man #hits #ikhwan #lfl #dakwah #cantik #tausiyah #kekinian"),
    ("StatusLucuOfficialPage", "Status Lucu", "#meme #lucu #dagelan #indonesia #l4l #viral #motivasi #ngakak #girl #ngakakkocak #hijab #kocak #islam #videolucu #reminder #lucubanget #man #lucuabis #negeriakhirat #jakarta #muhasabah #love #jalan2man #hits #ikhwan #lfl #dakwah #cantik #tausiyah #kekinian"),
    ("animeme.ngakak.lovers", "Animeme Ngakak Lovers", "#anime #meme #memeanime #manga #animememe #dagelan #art #indonesia #japan #l4l #drawing #motivasi #otaku #girl #hijab #cosplay #islam #love #reminder #animeart #man #sketch #negeriakhirat #naruto #muhasabah #artwork #jalan2man #onepiece #ikhwan #game"),
    ("SpongebobSquarepants.137925052968299", "Cerita Konyol Patrick & SpongeBob (FunPage)", "#memespongebob #spongebob #memes #spongebobsquarepants #spongebobmemes #art #patrickstar #squidward #video #lol #graffiti #tweet #dankmemes #caricature #sms #artist #rapfrançais #instatweet #citationsdefilles #worldofpencils #citationfrançaise #sketch #citationamitié #popart #blague #painting #memesdaily #illustratorart #halloween #work"),
    ("k.harianmemerandom", "Kesegaran Harian Meme Random", "#meme #lucu #dagelan #indonesia #l4l #viral #motivasi #ngakak #girl #ngakakkocak #hijab #kocak #islam #videolucu #reminder #lucubanget #man #lucuabis #negeriakhirat #jakarta #muhasabah #love #jalan2man #hits #ikhwan #lfl #dakwah #cantik #tausiyah #kekinian"),
    ("KeluhKesahKehidupanBerTeknologi", "Keluh Kesah Kehidupan Ber Teknologi", "#memeteknologi #teknologi #hujatanteknologi #paytren #teknologilucu #paytreninaja #aplikasi #bisnis #lowongankerja #viral #iburumahtangga #sedekah #inovasi #bisnissyariah #paymentdigital #suksesberjamaah #paytrenmudah #paytrencerdas #testimonipaytren #lagihits #lowker #infoloker #exploreindonesia #yukngaji #temansetiabayarbayar #pekerja #paytrenindonesia #jamannow #buruhpabrik #paytrenkeren"),
    ("ProgrammersCreateLife", "I am Programmer,I have no life.", "#memeprogrammer #programmer #programmerjokes #programming #developer #indonesia #code #coding #me #プログラマー #programmerlife #engineer #technology #tech #python #programminglife #programmerindonesia #jakarta #jokes #androiddeveloper #indo #html #development #konterhp #coder #php #gadgetindonesia #computer #java #android"),
    ("MemeAndRageComicIndonesia", "Meme & Rage Comic Indonesia", "#meme #lucu #dagelan #indonesia #l4l #viral #motivasi #ngakak #girl #ngakakkocak #hijab #kocak #islam #videolucu #reminder #lucubanget #man #lucuabis #negeriakhirat #jakarta #muhasabah #love #jalan2man #hits #ikhwan #lfl #dakwah #cantik #tausiyah #kekinian"),
    ("mtsb.id", "Meme Troll Sepak Bola", "#memesepakbola #bola #sepakbola #infokukar #futsal #ajiimbut #jerseyfutsal #sepakbolaindonesia #we12emitramania #jersey #timnas #bajubola #jerseyprinting #bajufutsal #jerseymurah #nagamekes #persib #mitrakukar #persija #indonesia #memetrollsepakbola #liga1 #mememitrakukar #baliunited #jerseysepakbola #kukar #arema #sepakboladunia #konveksijersey #jerseyjakarta"),
    ("228102444674369", "Rakyat +62", "#meme #lucu #dagelan #indonesia #l4l #viral #motivasi #ngakak #girl #ngakakkocak #hijab #kocak #islam #videolucu #reminder #lucubanget #man #lucuabis #negeriakhirat #jakarta #muhasabah #love #jalan2man #hits #ikhwan #lfl #dakwah #cantik #tausiyah #kekinian"),
    ("StatusLucuOfficialPage", "Status Lucu", "#meme #lucu #dagelan #indonesia #l4l #viral #motivasi #ngakak #girl #ngakakkocak #hijab #kocak #islam #videolucu #reminder #lucubanget #man #lucuabis #negeriakhirat #jakarta #muhasabah #love #jalan2man #hits #ikhwan #lfl #dakwah #cantik #tausiyah #kekinian"),
    ("SarcasmLol", "Sarcasm", "#meme #lucu #dagelan #indonesia #l4l #viral #motivasi #ngakak #girl #ngakakkocak #hijab #kocak #islam #videolucu #reminder #lucubanget #man #lucuabis #negeriakhirat #jakarta #muhasabah #love #jalan2man #hits #ikhwan #lfl #dakwah #cantik #tausiyah #kekinian"),
    ("jokesvala", "Programmer Jokes", "#memeprogrammer #programmer #programmerjokes #programming #developer #indonesia #code #coding #me #プログラマー #programmerlife #engineer #technology #tech #python #programminglife #programmerindonesia #jakarta #jokes #androiddeveloper #indo #html #development #konterhp #coder #php #gadgetindonesia #computer #java #android"),
    ("hujatotomotifofficial", "Hujatan Otomotif Indonesia Official", "#memeteknologi #teknologi #hujatanteknologi #paytren #teknologilucu #paytreninaja #aplikasi #bisnis #lowongankerja #viral #iburumahtangga #sedekah #inovasi #bisnissyariah #paymentdigital #suksesberjamaah #paytrenmudah #paytrencerdas #testimonipaytren #lagihits #lowker #infoloker #exploreindonesia #yukngaji #temansetiabayarbayar #pekerja #paytrenindonesia #jamannow #buruhpabrik #paytrenkeren"),
    ("Bapakheerp", "Dr bpk prof heerp suheerp", "#meme #lucu #dagelan #indonesia #l4l #viral #motivasi #ngakak #girl #ngakakkocak #hijab #kocak #islam #videolucu #reminder #lucubanget #man #lucuabis #negeriakhirat #jakarta #muhasabah #love #jalan2man #hits #ikhwan #lfl #dakwah #cantik #tausiyah #kekinian"),
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
    g_hashtags = g[2]

    try:
        posts = get_posts(pages=3, group=g_id, sleep=5)

        for i, post in enumerate(posts):
            image = post['image']
            text = post['text']

            # save to txt file
            with open('results.txt', 'a', encoding="utf-8") as f:
                if image:
                    f.write(f"{g_name}|჻|{image}|჻|{text}|჻|{g_hashtags}ᴣᴣᴣ")

            # stop after 10
            if i == 10:
                break
    except Exception as e:
        print(e)

elif rand_fb_type == "page":
    p = random.choice(p_ids)
    p_id = p[0]
    p_name = p[1]
    p_hashtags = p[2]

    try:
        posts = get_posts(p_id, pages=3, sleep=5)

        for i, post in enumerate(posts):
            image = post['image']
            text = post['text']

            # save to txt file
            with open('results.txt', 'a', encoding="utf-8") as f:
                if image:
                    f.write(f"{p_name}|჻|{image}|჻|{text}|჻|{p_hashtags}ᴣᴣᴣ")

            # stop after 10
            if i == 10:
                break
    except Exception as e:
        print(e)

elif rand_fb_type == "search":
    search = "science"

    try:
        posts = get_posts_by_search(search, pages=3, sleep=5)

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
