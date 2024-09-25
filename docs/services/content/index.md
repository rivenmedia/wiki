Riven supports various content services to help you manage and update your media library. Below is a list of the supported services, their configuration options, and examples of what to enter for each field.

### Available Services

- [Overseerr](#overseerr)
- [Plex Watchlist](#plex-watchlist)
- [Mdblist](#mdblist)
- [Listrr](#listrr)
- [Trakt](#trakt)

---

## **Overseerr**

Overseerr is a request management and media discovery tool. It helps you manage requests for your media library.

- **enabled** (boolean): Boolean value to enable or disable the service. Default is true.
    - Example: `true`
- **update_interval** (integer): The interval in seconds at which the service will check for updates. Default is 60 seconds.
    - Example: `60`
- **url** (string): The URL of your Overseerr instance. Default is "http://localhost:5055".
    - Example: `"http://localhost:5055"`
- **api_key** (string): The API key for accessing Overseerr.
    - Example: `"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`
- **use_webhook** (boolean): Boolean value to enable or disable the use of webhooks. Default is true.
    - Example: `true`

---

## **Plex Watchlist**

Plex Watchlist allows you to keep track of your desired media content.

- **enabled** (boolean): Boolean value to enable or disable the service. Default is true.
    - Example: `true`
- **update_interval** (integer): The interval in seconds at which the service will check for updates. Default is 60 seconds.
    - Example: `60`
- **rss** (list of strings): A list of RSS feed URLs for your Plex Watchlist.
    - Example: `["https://rss.plex.tv/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"]`

---

## **Mdblist**

Mdblist is a service that provides curated lists of media content.

- **enabled** (boolean): Boolean value to enable or disable the service. Default is false.
    - Example: `false`
- **update_interval** (integer): The interval in seconds at which the service will check for updates. Default is 300 seconds.
    - Example: `300`
- **api_key** (string): The API key for accessing Mdblist.
    - Example: `"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`
- **lists** (list of strings): A list of Mdblist URLs for curated media lists.
    - Example: `["https://mdblist.com/lists/xxxxxxx/xxxxxxxxxx"]`

!!! note "lists also accept a list of ids"
    - Example: `["123456", "654321"]`

---

## **Listrr**

Listrr is a service for managing movie and show lists.

- **enabled** (boolean): Boolean value to enable or disable the service. Default is false.
    - Example: `false`
- **update_interval** (integer): The interval in seconds at which the service will check for updates. Default is 300 seconds.
    - Example: `300`
- **movie_lists** (list of ints): A list of IDs for movie lists.
    - Example: `[123456, 789012]`
- **show_lists** (list of ints): A list of IDs for show lists.
    - Example: `[345678, 901234]`
- **api_key** (string): The API key for accessing Listrr.
    - Example: `"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`

---

## **Trakt**

Trakt is a service that helps you keep track of what you're watching and discover new content.

- **enabled** (boolean): Boolean value to enable or disable the service. Default is false.
    - Example: `false`
- **update_interval** (integer): The interval in seconds at which the service will check for updates. Default is 60 seconds.
    - Example: `60`
- **api_key** (string): The API key for accessing Trakt.
    - Example: `"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`
- **watchlist** (list of strings): A list of Trakt usernames.
    - Example: `["username1", "username2"]`
- **user_lists** (list of strings): A list of Trakt user list URLs.
    - Example: `["https://trakt.tv/users/username/lists/xxxxxxxx"]`
- **collection** (list of strings): A list of Trakt collection usernames.
    - Example: `["username1", "username2"]`
- **fetch_trending** (boolean): Boolean value to enable or disable fetching trending content. Default is true.
    - Example: `true`
- **trending_count** (integer): The number of trending items to fetch. Default is 10.
    - Example: `10`
- **fetch_popular** (boolean): Boolean value to enable or disable fetching popular content. Default is true.
    - Example: `true`
- **popular_count** (integer): The number of popular items to fetch. Default is 10.
    - Example: `10`