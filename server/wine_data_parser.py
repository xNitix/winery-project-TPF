import requests
from bs4 import BeautifulSoup
import random
import json

HOW_MANY_PAGES = 5

map_dict = {
    "Type": "color",
    "Country": "country",
    "Vintage": "year",
    "Style": "taste",
    "Alcohol": "alcohol",
    "Volume": "volume"
}

countries_dict = {
    "Argentina": "AR",
    "Australia": "AU",
    "Brazil": "BR",
    "Chile": "CL",
    "China": "CN",
    "Germany": "DE",
    "Spain": "ES",
    "France": "FR",
    "Italy": "IT",
    "New Zealand": "NZ",
    "Portugal": "PT",
    "Romania": "RO",
    "Russia": "RU",
    "United States": "US",
    "South Africa": "ZA",
    "Poland": "PL",
    "Hungary": "HU",
    "Austria": "AT",
    "California": "US",
    "Portugalia": "PT"
}

tastes_dict = {
    "Dry": 1,
    "Sweet": 2,
    "Oaked": 3,
    "Semi-sweet": 4,
    "Extra Dry": 5, 
    "Semi-dry": 6,
    "Brut": 7
}

colors_dict = {
    "Red": 1,
    "White": 2,
    "Rose": 3,
    "Gray": 4,
    "Orange": 5,
    "Tawny": 6,
    "Yellow": 7,
    "Sparkling": 8,
    "Sprakling": 8,
    "Gin": 9,
    "Port": 10
}

def parse_wine_page(url):
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')

        title = soup.find('div', class_='product-sticky-header').find('h1').text.strip().split(',')[0].replace("\"", "")

        element = soup.find('div', class_='description')
        if element is not None:
            description = element.text.strip()
        else:
            description = "Element not found"

        price = soup.find('div', class_='price').text.strip().replace("zł", "")

        image_url = soup.find('li', class_="main-image").find('img')['src']

        wine_data = {
            'name': title,
            'description': description,
            'image_url': image_url,
            'price': price,
            'units_in_stock': random.randint(0, 123)
        }
        
        table = soup.find('table', class_='table')
        if table:
            rows = table.find_all('tr')
            for row in rows:
                columns = row.find_all('td')
                if len(columns) == 2:
                    key = columns[0].text.strip()
                    value = columns[1].text.strip()
                    if key in map_dict:
                        wine_data[map_dict[key]] = value

        # Delete ml            
        if 'volume' not in wine_data:
            wine_data['volume'] = int(random.choice(["500", "750", "1000"]))
        else:
            wine_data['volume'] = int(wine_data['volume'].replace(" ", "").replace("ml", ""))

        if 'country' not in wine_data:
            wine_data['country'] = str(random.choice(["Spain", "Italy", "Poland", "Hungary", "Argentina"]))
        
        # Replace country with primary key
        if wine_data['country'] not in countries_dict.keys():
            print(wine_data['country'])
            iso_code = input('ISO Code: ')
            countries_dict[wine_data['country']] = iso_code

        wine_data['country'] = countries_dict[wine_data['country']]

        if 'color' not in wine_data:
            wine_data['color'] = str(random.choice(list(colors_dict.keys())))

        # Replace color with primary key
        if wine_data['color'] not in colors_dict.keys():
            print(wine_data['color'])
            pk = input('Primary key: ')
            colors_dict[wine_data['color']] = int(pk)
        
        wine_data['color'] = colors_dict[wine_data['color']]

        if 'taste' not in wine_data:
            wine_data['taste'] = str(random.choice(list(tastes_dict.keys())))

        # Replace taste with primary key
        if wine_data['taste'] not in tastes_dict.keys():
            print(wine_data['taste'])
            pk = input('Primary key: ')
            tastes_dict[wine_data['taste']] = int(pk)
        
        wine_data['taste'] = tastes_dict[wine_data['taste']]

        if 'year' not in wine_data:
            wine_data['year'] = str(random.randint(1920, 2015))

        # Delete percent sign
        if 'alcohol' not in wine_data:
            wine_data['alcohol'] = float(random.randint(7, 15))
        else:
            wine_data['alcohol'] = float(wine_data['alcohol'].replace(" ", "").replace("%", ""))

        if len(wine_data['year']) != 4:
            if len(wine_data['year']) == 2:
                wine_data['year'] = str(random.randint(1920, 2015))
            else:
                wine_data['year'] = wine_data['year'].split('/')[0]

        wine_data['year'] = int(wine_data['year'])
        wine_data['price'] = float(wine_data['price'].replace(",", ".").replace(" ", ""))

        return wine_data
    else:
        return f"Failed to retrieve data, status code: {response.status_code}"

def get_wine_links(url):
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')

        wine_links = []
        wines = soup.find('div', id="content").find_all('div', class_='product-thumb')

        for wine in wines:
            link = wine.find('a')['href']
            wine_links.append(link)

        return wine_links
    else:
        return f"Failed to retrieve data, status code: {response.status_code}"

url = "https://www.wine-express.pl/en/wines?page="
wine_links = []

for i in range(1, HOW_MANY_PAGES + 1):
    wine_links += get_wine_links(url + str(i))

db_data = []

for i, link in enumerate(wine_links, 1):
    db_model = {
        'model': 'base.wine',
        'pk': i,
        'fields': parse_wine_page(link)
    }

    db_data.append(db_model)

print(db_data)

with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(db_data, f, ensure_ascii=False, indent=2)

print(countries_dict)
print(tastes_dict)
print(colors_dict)