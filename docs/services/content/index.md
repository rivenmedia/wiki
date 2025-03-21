# **Content Services**

Riven supports various content services to help you manage and update your media library. Below is a list of the supported services, their configuration options, and examples of what to enter for each field.

### **Available Services**

- [Overseerr](#overseerr)
- [Plex Watchlist](#plex-watchlist)
- [Mdblist](#mdblist)
- [Listrr](#listrr)
- [Trakt](#trakt)

!!! warning "Atleast one service must be enabled"

    Atleast one service must be enabled to leverage the content services.

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
- **use_webhook** (boolean): Boolean value to enable or disable the use of webhooks. Default is false.
    - Example: `false`

### Setting up Overseerr Webhook

- Go to the settings page on Overseerr
- Click on `Notifications`
- Click on `Webhook` on the end
- Toggle `Enable Agent` so that it's enabled
- For the Webhook URL:
  - Enter the FQDN, IP or `localhost` to your Riven instance, and then be sure to add `/api/v1/webhook/overseerr` at the end of it
- Leave the rest of the settings default, however you'll want to enable these Notification types:
  - `Request Automatically Approved`
  - `Request Approved`

So that only approved requests will get sent from the webhook from Overseerr. Adjust this based on your needs. Any of the following examples might be correct depending on your setup.

- Example 1: `http://localhost:8080/api/v1/webhook/overseerr`
- Example 2: `http://riven:8080/api/v1/webhook/overseerr`

After all that's setup, you should be good to go. If you experience any issues, double check the ip/port you're using to access the backend of Riven is correct. The backend port of Riven is `8080` by default. 

![overseerr](../../images/overseerr.png)

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

!!! note "Trakt Client ID Required"

    You need to create an API app within your Trakt Profile.

    1. Navigate to https://trakt.tv/oauth/applications/new
    2. Name it whatever you like.
    3. For `Redirect uri:` use the default value of `urn:ietf:wg:oauth:2.0:oob`.
    4. `Description:`, `Javascript (cors) origins:`, and `Permissions:` can be left blank/default.
    5. Click on `SAVE APP`.
    6. Use the `Client ID:` provided as your `Trakt Api Key` in the Riven settings, found in the `Content` section.

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
