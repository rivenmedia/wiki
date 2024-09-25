# **Symlink Services**

Riven supports various symlink configurations to help you manage and organize your media libraries within the docker container. Below is a list of the supported symlink configurations, their options, and examples of what to enter for each field.

!!! note "How it works"

    We symlink the files after they have been downloaded, so we can stream them directly from the remote storage.

---

## **Symlink Configuration**

This section is for setting up your symlinks in regards to how they match inside the docker container. Users will need to be extra careful as to make sure that the rclone path and library paths are owned by the user, and exist.

- **rclone_path** (string): The path where rclone mounts your remote storage. If you are using Zurg, point this to the `__all__` directory, which is always created by default and displays all files collectively.
    - Example with Zurg: `"/mnt/zurg/__all__"`
    - Example without Zurg: `"/mnt/zurg"`
- **library_path** (string): The path to your local media library.
    - Example: `"/mnt/library"`

    !!! warning "Availability and Permissions"

        Before starting the docker container, ensure that both the `rclone_path` and `library_path` exist and have the correct permissions.

        These paths must be compatible with the Riven application and the media player you are using. For instance, if Riven runs with user ID 1000, then both paths should be owned by user ID 1000, and this applies to Plex as well.

- **separate_anime_dirs** (boolean): Boolean value to enable or disable separate directories for anime
    - Example: `false`

    !!! warning "Set this during initial setup!"

        This is very important to set during initial setup, as it will ensure that your media libraries are organized correctly.

- **repair_symlinks** (boolean): Boolean value to enable or disable automatic repair of broken symlinks
    - Example: `false`

    !!! tip "Use often, but not too often!"

        This can be useful as symlinks can sometimes get broken, and this will help you fix them.

    !!! note "How it works"

        We will crawl the library path, and if a symlink is broken (no longer points to a valid file), we will try to search for the file and create a new symlink. If we cannot find the file, we will remove the symlink, and update the item in the database. Causing it to get re-scraped.

- **repair_interval** (float): The interval in hours at which the symlinks will be checked and repaired if necessary.
    - Example: `72.0`

---

## **Rclone** *(required)*

We have seen that running this as a systemd service is the most reliable way to ensure that the symlinks are created and maintained correctly.

Open up your favorite text editor, and add the following configuration:

```conf title="/etc/systemd/system/rclone.service"
[Unit]
Description=Rclone Mount Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/rclone mount zurg:__all__ /mnt/zurg --allow-other --dir-cache-time 10s --vfs-cache-mode full --vfs-read-chunk-size 8M --vfs-read-chunk-size-limit 2G --buffer-size 16M --vfs-cache-max-age 150h --vfs-cache-max-size 20G --vfs-fast-fingerprint --uid 1000 --gid 1000
ExecStop=/bin/fusermount -u /mnt/zurg
Restart=always
User=riven
Group=riven

[Install]
WantedBy=default.target
```

!!! warning "Permissions"

    Ensure that the user and group are correct for your setup. This example uses `riven` as the user and group. Also be sure to adjust the `uid` and `gid` to your own user and group.

These settings have worked well for me, but consider testing with your own setup.

After adding the configuration, restart the service with the following command:

```bash
sudo systemctl daemon-reload && \
sudo systemctl enable rclone && \
sudo systemctl start rclone
```

!!! tip "Validate the setup"

    You can validate the setup by running the following command:

    ```bash
    sudo systemctl status rclone
    ```

    And making sure that files are properly loaded into the mount point. In this example, it would be `/mnt/zurg` if you are using Zurg.

    ```bash
    ls -al /mnt/zurg
    ```

---

## **Zurg** *(optional)*

When using Zurg, ensure that your `rclone_path` points to the `__all__` directory (`/mnt/zurg/__all__`) to leverage Zurg's capabilities effectively. This directory aggregates all files, providing a unified view.

### Configuring Zurg with Riven Symlinks

1. **Set the `rclone_path` to `/mnt/zurg/__all__`** in your symlink configuration. This ensures that all media files are accessible through the aggregated `__all__` directory.
2. **Ensure Zurg is configured correctly** by following the [Zurg Configuration Documentation](https://github.com/debridmediamanager/zurg-testing/wiki/Config-v0.10), which includes setting up the `config.yaml` with appropriate filters and directory definitions.
3. **Verify Permissions:** Make sure that both the `rclone` mount point and the library paths are owned by the user running the docker container to avoid permission issues.
4. **Restart Services:** After configuration, restart the Riven and Zurg services to apply the changes.

---

!!! note "Zurg Configuration"

    When configuring Zurg, ensure that the following settings are included in your `config.yaml` to maintain proper folder and torrent naming conventions:

    - **retain_folder_name_extension** (boolean): This setting should be set to `true` to retain the folder name extension.
        - Example: `retain_folder_name_extension: true`
    - **retain_rd_torrent_name** (boolean): This setting should be set to `true` to retain the Real-Debrid torrent name.
        - Example: `retain_rd_torrent_name: true`

Be sure to add the configuration file to setup Zurg. More information can be found [here](https://github.com/debridmediamanager/zurg-testing/wiki/Config-v0.10).

```conf title="~/.config/rclone/rclone.conf"
[zurg]
type = webdav
url = http://172.21.0.2:9999/dav
vendor = other
pacer_min_sleep = 0
```

The latest configuration file for Zurg can be found [here](https://raw.githubusercontent.com/debridmediamanager/zurg-testing/main/config.yml).