# **Updater Services**

Riven supports various updaters to help you manage and update your media libraries. Below is a list of the supported updaters, their configuration options, and examples of what to enter for each field.

!!! tip

    We label them as "Updaters" here, which is just an alias for "Media Servers".

### **Available Updaters**

- [Plex](#plex)
- [Jellyfin](#jellyfin)
- [Emby](#emby)

!!! note "How it works"

    After an item has been added to your library, we update the corresponding media library.

---

## **Plex**

Plex is a media server that organizes your media and streams it to your devices.

- **enabled** (boolean): Boolean value to enable or disable the updater. Default is true.
    - Example: `true`
- **token** (string): The token for accessing Plex.
    - Example: `"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`
- **url** (string): The URL of your Plex server. Default is "http://localhost:32400".
    - Example: `"http://localhost:32400"`

---

## **Jellyfin**

Jellyfin is a free software media system that puts you in control of managing and streaming your media.

- **enabled** (boolean): Boolean value to enable or disable the updater. Default is false.
    - Example: `false`
- **api_key** (string): The API key for accessing Jellyfin.
    - Example: `"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`
- **url** (string): The URL of your Jellyfin server. Default is "http://localhost:8096".
    - Example: `"http://localhost:8096"`

---

## **Emby**

Emby is a media server designed to organize, play, and stream audio and video to a variety of devices.

- **enabled** (boolean): Boolean value to enable or disable the updater. Default is false.
    - Example: `false`
- **api_key** (string): The API key for accessing Emby.
    - Example: `"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`
- **url** (string): The URL of your Emby server. Default is "http://localhost:8096".
    - Example: `"http://localhost:8096"`

---

## **Updater Interval**

The interval in seconds at which the updaters will check for updates. Default is 120 seconds.

- **updater_interval** (integer): The interval in seconds.
    - Example: `120`
