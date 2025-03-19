import json
from pprint import pprint
import sqlite3
import requests
import time
import pathlib
dbfile = './db03042025.db'

# Calcul les dégâts des attaques spéciales
def calc_super_attack_damage(base_attack: int, special_description: str):
    super_attack_multiplier = {
        "low": 1.3,
        # "damage": 1.7,
        "huge": 2,
        "destructive": 2,
        "extreme": 2.2,
        "mass": 2.2,
        "supreme": 2.5,
        "immense": 2.8,
        "colossal": 3,
        "mega-colossal": 3.5
    }
    total: int = 0
    for multiplier in super_attack_multiplier:
        if multiplier in special_description.split():
            total = base_attack * super_attack_multiplier[multiplier]
            print(super_attack_multiplier[multiplier])
            return round(total)
      

# Retourne l'élément et le type d'un personnage par rapport à la valeur de son élément
def get_type_class(element: int):
    elements = {
        "10": "Super AGL",
        '11': "Super TEQ",
        "12": "Super INT",
        "13": "Super STR",
        "14": "Super PHY",
        "20": "Extreme AGL",
        "21": "Extreme TEQ",
        "22": "Extreme INT",
        "23": "Extreme STR",
        "24": "Extreme PHY"
    }
    for el in elements:
        if int(el) == element:
            return elements[el]

def feed_cards():
    con = sqlite3.connect(dbfile)

    con.row_factory = sqlite3.Row
    cur = con.cursor()
    query = "SELECT * FROM (SELECT cards.id AS 'card_id', cards.name AS 'card_name', cards.element AS 'card_element', standby_skill_sets.bgm_id AS 'standby_bgm_id', finish_skill_sets.name AS 'finish_name', finish_skill_sets.bgm_id AS 'finish_skill_bgm_id'  FROM cards JOIN card_standby_skill_set_relations ON cards.id = card_standby_skill_set_relations.card_id JOIN standby_skill_sets ON card_standby_skill_set_relations.standby_skill_set_id = standby_skill_sets.id JOIN standby_skill_set_finish_skill_set_relations ON standby_skill_set_finish_skill_set_relations.standby_skill_set_id = standby_skill_sets.id JOIN finish_skill_sets ON standby_skill_set_finish_skill_set_relations.finish_skill_set_id = finish_skill_sets.id ORDER BY cards.id DESC) GROUP BY standby_bgm_id"
    cur.execute(query)
    row = cur.fetchall()
    for card in row:
          t, c = get_type_class(card['card_element']).split(' ')
          print(t, c)
          data = {
            "id": card['card_id'],
            "name": card['card_name'],
            "type": t,
            "class": c
            }
          print(data)
          res = requests.post('http://localhost:3000/cards', data=data)
          print(res.json())
          time.sleep(3)

def feed_as():
    con = sqlite3.connect(dbfile)

    con.row_factory = sqlite3.Row
    cur = con.cursor()
    query = "SELECT * FROM (SELECT cards.id as 'card_id', cards.element AS 'card_element', cards.name AS 'card_name', active_skill_sets.name AS 'as_name', active_skill_sets.id AS 'as_id', active_skill_sets.bgm_id FROM active_skill_sets JOIN card_active_skills ON active_skill_sets.id = card_active_skills.active_skill_set_id JOIN cards ON card_active_skills.card_id = cards.id WHERE bgm_id IS NOT NULL ORDER BY cards.id DESC) GROUP BY bgm_id"
    cur.execute(query)
    row = cur.fetchall()

    for card in row:
        data = {
            "id": card['as_id'],
            "name": card['as_name'],
            "bgm_id": card['bgm_id'],
            "card_id": card['card_id']
        }
        print(data)
        res = requests.post('http://localhost:3000/active-skills', data=data)
        print(res.json())
        time.sleep(3)
      

def feed_bgm():
    folder = pathlib.Path('./wav_from_sample')

    for file in folder.iterdir():
        bgm_id = int(str(file).split('_')[3].split('.')[0])
        data = {
            "id": bgm_id,
            "description": ""
        }
        print(f'sending request for bgm {bgm_id}')
        res = requests.post('http://localhost:3000/bgm', data=data)
        print(f'response for bgm_id {bgm_id} {res.json()}')
        time.sleep(3)

def feed_standby_skills():
    con = sqlite3.connect(dbfile)

    con.row_factory = sqlite3.Row
    cur = con.cursor()
    query = "SELECT * FROM (SELECT cards.id AS 'card_id', cards.name AS 'card_name', card_standby_skill_set_relations.standby_skill_set_id AS 'standby_skill_id', standby_skill_set_finish_skill_set_relations.finish_skill_set_id AS 'finish_skill_id', standby_skill_sets.bgm_id AS 'standby_skill_bgm_id', finish_skill_sets.name AS 'finish_name', finish_skill_sets.bgm_id AS 'finish_skill_bgm_id'  FROM cards JOIN card_standby_skill_set_relations ON cards.id = card_standby_skill_set_relations.card_id JOIN standby_skill_sets ON card_standby_skill_set_relations.standby_skill_set_id = standby_skill_sets.id JOIN standby_skill_set_finish_skill_set_relations ON standby_skill_set_finish_skill_set_relations.standby_skill_set_id = standby_skill_sets.id JOIN finish_skill_sets ON standby_skill_set_finish_skill_set_relations.finish_skill_set_id = finish_skill_sets.id ORDER BY cards.id DESC) GROUP BY finish_skill_bgm_id"
    cur.execute(query)
    row = cur.fetchall()

    for card in row:
        data = {
            "id": card['standby_skill_id'],
            "description": card['card_name'] + ' Standby Skill',
            "bgm_id": card['standby_skill_bgm_id'],
            "card_id": card['card_id']
        }
        print(data)
        res = requests.post('http://localhost:3000/standbyskills', data=data)
        print(res.json())
        time.sleep(3)

def feed_finish_skills():
    con = sqlite3.connect(dbfile)

    con.row_factory = sqlite3.Row
    cur = con.cursor()
    query = "SELECT * FROM (SELECT cards.id AS 'card_id', cards.name AS 'card_name', card_standby_skill_set_relations.standby_skill_set_id AS 'standby_skill_id', standby_skill_set_finish_skill_set_relations.finish_skill_set_id AS 'finish_skill_id', standby_skill_sets.bgm_id AS 'standby_bgm_id', finish_skill_sets.name AS 'finish_name', finish_skill_sets.bgm_id AS 'finish_skill_bgm_id'  FROM cards JOIN card_standby_skill_set_relations ON cards.id = card_standby_skill_set_relations.card_id JOIN standby_skill_sets ON card_standby_skill_set_relations.standby_skill_set_id = standby_skill_sets.id JOIN standby_skill_set_finish_skill_set_relations ON standby_skill_set_finish_skill_set_relations.standby_skill_set_id = standby_skill_sets.id JOIN finish_skill_sets ON standby_skill_set_finish_skill_set_relations.finish_skill_set_id = finish_skill_sets.id ORDER BY cards.id DESC) GROUP BY finish_skill_bgm_id"
    cur.execute(query)
    row = cur.fetchall()
    for finish_skill in row:
        data = {
            "id": finish_skill['finish_skill_id'],
            "name": finish_skill['finish_name'],
            "bgm_id": finish_skill['finish_skill_bgm_id'],
            "standby_skill_id": finish_skill['standby_skill_id']
        }
        print(data)
        res = requests.post('http://localhost:3000/finishskills', data=data)
        print(res.json())
        time.sleep(3)


def feed_entrances():
    con = sqlite3.connect(dbfile)

    con.row_factory = sqlite3.Row
    cur = con.cursor()
    query = "SELECT * FROM (SELECT cards.id AS 'card_id', cards.element AS 'card_element', passive_skill_effects.bgm_id AS 'bgm_id', cards.name AS 'card_name', cards.open_at, passive_skills.passive_skill_effect_id FROM cards JOIN passive_skills ON cards.passive_skill_set_id = passive_skills.id JOIN passive_skill_effects ON passive_skills.passive_skill_effect_id = passive_skill_effects.id AND passive_skill_effects.bgm_id IS NOT NULL ORDER BY cards.id DESC) GROUP BY passive_skill_effect_id "
    cur.execute(query)
    row = cur.fetchall()
    for card in row:
        t, c = get_type_class(card['card_element']).split(' ')
        data = {
            "id": card['passive_skill_effect_id'],
            "card_id": card['card_id'],
            "bgm_id": card['bgm_id'],
            "name": card['card_name'] + ' Entrance'
        }
        print(data)
        res = requests.post('http://localhost:3000/entrances', data=data)
        print(res.json())
        time.sleep(3)


def add_thumbs():
    con = sqlite3.connect(dbfile)
    con.row_factory = sqlite3.Row
    res = requests.get('http://localhost:3000/cards')
    json_data = json.loads(res.text)
    for data in json_data:
        print(data['id'])

        cur = con.cursor()
        query = "SELECT resource_id, bg_effect_id FROM cards WHERE id = ?"
        param = (data['id'],)  
        cur.execute(query, param)
        row = cur.fetchone()
        js = {'thumb': int(data['id']) - 1}
   
        if row[0] is None:
            print('Aucune resource_id', row[0])
        else:
            js["thumb"] = int(row[0]) - 1
            print('Resource_id : ', int(row[0]) - 1)
        if row[1] is None:
            print('Aucun bg_effect_id', row[1])
        else:
            print('Bg_effect_id : ', row[1])
            js["thumb"] = int(row[1])
        res = requests.put('http://localhost:3000/thumbs/' + str(data['id']), data=js)
        print(res.json())
        time.sleep(3)

def add_is_legendary():
    con = sqlite3.connect(dbfile)
    con.row_factory = sqlite3.Row
    res = requests.get('http://localhost:3000/cards')
    json_data = json.loads(res.text)
    for data in json_data:
        print(data['id'])

        cur = con.cursor()
        query = "SELECT rarity FROM cards WHERE id = ?"
        param = (data['id'],)  
        cur.execute(query, param)
        row = cur.fetchone()
        js = {'is_legendary': False}

        if row[0] is 4:
            print('rarity is 4', row[0])
            js['is_legendary'] = False

        if row[0] is 5:
            print('rarity is 5', row[0])
            js['is_legendary'] = True

        res = requests.put('http://localhost:3000/is-legendary/' + str(data['id']), data=js)
        print(res.json())
        time.sleep(3)

add_is_legendary()