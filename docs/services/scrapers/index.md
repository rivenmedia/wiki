# **Scrapers**

Riven supports various scrapers to help you gather metadata and other information for your media content. Below is a list of the supported scrapers, their configuration options, and examples of what to enter for each field.

### **Available Scrapers**

- [Torrentio](#torrentio)
- [Knightcrawler](#knightcrawler)
- [Jackett](#jackett)
- [Prowlarr](#prowlarr)
- [Orionoid](#orionoid)
- [Annatar](#annatar)
- [Torbox Scraper](#torbox-scraper)
- [Mediafusion](#mediafusion)
- [Zilean](#zilean)
- [Comet](#comet)

!!! warning "Atleast one scraper must be enabled"

    Atleast one scraper must be enabled to leverage the scrapers.

---

## **Torrentio**

Torrentio is a scraper that provides high-quality torrent links.

- **enabled** (boolean): Boolean value to enable or disable the service. Default is true.
    - Example: `true`
- **filter** (string): Filter to apply to the results. Default is "qualityfilter=other,scr,cam".
    - Example: `"qualityfilter=other,scr,cam"`
- **url** (string): The URL of the Torrentio instance. Default is "http://torrentio.strem.fun".
    - Example: `"http://torrentio.strem.fun"`
- **timeout** (integer): The timeout in seconds for the scraper. Default is 30 seconds.
    - Example: `30`
- **ratelimit** (boolean): Boolean value to enable or disable rate limiting. Default is false.
    - Example: `false`

---

## **Knightcrawler**

Knightcrawler is a scraper that provides high-quality torrent links.

- **enabled** (boolean): Boolean value to enable or disable the service. Default is false.
    - Example: `false`
- **filter** (string): Filter to apply to the results. Default is "sort=qualitysize%7Cqualityfilter=480p,scr,cam,unknown".
    - Example: `"sort=qualitysize%7Cqualityfilter=480p,scr,cam,unknown"`
- **url** (string): The URL of the Knightcrawler instance. Default is "https://knightcrawler.elfhosted.com/".
    - Example: `"https://knightcrawler.elfhosted.com/"`
- **timeout** (integer): The timeout in seconds for the scraper. Default is 30 seconds.
    - Example: `30`
- **ratelimit** (boolean): Boolean value to enable or disable rate limiting. Default is false.
    - Example: `false`

---

## **Jackett**

Jackett is a scraper that provides high-quality torrent links.

- **enabled** (boolean): Boolean value to enable or disable the service. Default is false.
    - Example: `false`
- **url** (string): The URL of the Jackett instance. Default is "http://localhost:9117".
    - Example: `"http://localhost:9117"`
- **api_key** (string): The API key for accessing Jackett.
    - Example: `"xxxxxxxxxxxxxxxxxxxxxxxxx"`
- **timeout** (integer): The timeout in seconds for the scraper. Default is 10 seconds.
    - Example: `10`
- **ratelimit** (boolean): Boolean value to enable or disable rate limiting. Default is false.
    - Example: `false`

---

## **Prowlarr**

Prowlarr is a scraper that provides high-quality torrent links.

- **enabled** (boolean): Boolean value to enable or disable the service. Default is false.
    - Example: `false`
- **url** (string): The URL of the Prowlarr instance. Default is "http://localhost:9696".
    - Example: `"http://localhost:9696"`
- **api_key** (string): The API key for accessing Prowlarr.
    - Example: `"xxxxxxxxxxxxxxxxxxxxxxxxx"`
- **timeout** (integer): The timeout in seconds for the scraper. Default is 10 seconds.
    - Example: `10`
- **ratelimit** (boolean): Boolean value to enable or disable rate limiting. Default is false.
    - Example: `false`
- **limiter_seconds** (integer): The number of seconds to wait between requests. Default is 60 seconds.
    - Example: `60`

---

## **Orionoid**

Orionoid is a scraper that provides high-quality torrent links.

- **enabled** (boolean): Boolean value to enable or disable the service. Default is true.
    - Example: `true`
- **api_key** (string): The API key for accessing Orionoid.
    - Example: `"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"`
- **cached_results_only** (boolean): Boolean value to enable or disable cached results only. Default is false.
    - Example: `false`
- **parameters** (object): Additional parameters for the scraper. (Optional)
    - **video3d** (string): Whether to include 3D videos. Default is "false".
        - Example: `"false"`
    - **videoquality** (string): The quality of the videos to include. Default is "sd_hd8k".
        - Example: `"sd_hd8k"`
    - **limitcount** (integer): The maximum number of results to return. Default is 5.
        - Example: `5`
- **timeout** (integer): The timeout in seconds for the scraper. Default is 30 seconds.
    - Example: `30`
- **ratelimit** (boolean): Boolean value to enable or disable rate limiting. Default is true.
    - Example: `true`

---

## **Annatar**

Annatar is a scraper that provides high-quality torrent links.

- **enabled** (boolean): Boolean value to enable or disable the service. Default is false.
    - Example: `false`
- **url** (string): The URL of the Annatar instance. Default is "https://annatar.elfhosted.com".
    - Example: `"https://annatar.elfhosted.com"`
- **limit** (integer): The maximum number of results to return. Default is 2000.
    - Example: `2000`
- **timeout** (integer): The timeout in seconds for the scraper. Default is 10 seconds.
    - Example: `10`
- **ratelimit** (boolean): Boolean value to enable or disable rate limiting. Default is false.
    - Example: `false`

---

## **Torbox Scraper**

Torbox Scraper is a scraper that provides high-quality torrent links.

- **enabled** (boolean): Boolean value to enable or disable the service. Default is false.
    - Example: `false`
- **timeout** (integer): The timeout in seconds for the scraper. Default is 30 seconds.
    - Example: `30`

---

## **Mediafusion**

Mediafusion is a scraper that provides high-quality torrent links.

- **enabled** (boolean): Boolean value to enable or disable the service. Default is false.
    - Example: `false`
- **url** (string): The URL of the Mediafusion instance. Default is "https://mediafusion.elfhosted.com".
    - Example: `"https://mediafusion.elfhosted.com"`
- **timeout** (integer): The timeout in seconds for the scraper. Default is 10 seconds.
    - Example: `10`
- **ratelimit** (boolean): Boolean value to enable or disable rate limiting. Default is false.
    - Example: `false`
- **catalogs** (list of strings): A list of catalogs to include.
    - Example: `[]`

---

## **Zilean**

Zilean is a scraper that provides high-quality torrent links.

- **enabled** (boolean): Boolean value to enable or disable the service. Default is true.
    - Example: `true`
- **url** (string): The URL of the Zilean instance. Default is "http://localhost:8181".
    - Example: `"http://localhost:8181"`
- **timeout** (integer): The timeout in seconds for the scraper. Default is 30 seconds.
    - Example: `30`
- **ratelimit** (boolean): Boolean value to enable or disable rate limiting. Default is true.
    - Example: `true`

---

## **Comet**

Comet is a scraper that provides high-quality torrent links.

- **enabled** (boolean): Boolean value to enable or disable the service. Default is false.
    - Example: `false`
- **url** (string): The URL of the Comet instance. Default is "http://localhost:8000".
    - Example: `"http://localhost:8000"`
- **indexers** (list of strings): A list of indexers to include.
    - Example: `[]`
- **timeout** (integer): The timeout in seconds for the scraper. Default is 30 seconds.
    - Example: `30`
- **ratelimit** (boolean): Boolean value to enable or disable rate limiting. Default is false.
    - Example: `false`
