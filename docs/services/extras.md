---
hide:
  - navigation
---

# **Management Commands**

## **Resetting the Database**

To reset the Postgres database by dropping and recreating the `riven` table, you can use the following commands:

!!! danger

    This will cause ==all of the data== in your database to be lost. To include metadata and other data that's needed to run Riven.

=== "Docker"

    Make sure you have the postgres container running, and you should `docker stop riven` before running the following commands.

    ```bash
    docker exec -it postgres psql -U postgres -c "DROP TABLE IF EXISTS riven;"
    docker exec -it postgres psql -U postgres -c "CREATE DATABASE riven_db;"
    ```

=== "Env Variable"

    Set the `HARD_RESET` environment variable to `true` in your `.env` or `docker-compose.yml` file.

    ```yml
    HARD_RESET=true
    ```

    Then, restart Riven. Be sure to set `HARD_RESET` back to `false` after the reset is complete.

=== "Local"

    Make sure you have the postgres container running, before running the following commands.

    ```bash
    rm -rf data/alembic/
    poetry run python src/main.py --hard_reset_db
    ```

=== "Elfhosted"

    From the Riven backend (via the button on your Dashboard), press ++ctrl+c++ **twice** to restart Riven. Once it does, you will see the following instructions:

    - 💥 For the option to reset your database, press the ++x++ key within 10 seconds...

---

## **Resetting the Subtitles Database**

To reset the Subtitles database by deleting the `subliminal.dbm*` files, you can use the following command:

```bash
rm -r data/subliminal.dbm*
```

This needs to point to the `data` directory that the `settings.json` file is located in.

!!! warning

    This will delete all of your Subtitles database files, and you will lose all your Subtitles.

!!! note

    This is not necessary and only needed if you're experiencing issues with the Subtitles specifically.

---

## **Trigger Symlink Repair**

To trigger a symlink repair, you can use one of the following methods:

=== "Local"

    ```bash
    poetry run python /src/main.py --fix_symlinks
    ```

=== "Env Variable"

    Set the `FIX_SYMLINKS` environment variable to `true` in your `.env` file.

    ```yml
    FIX_SYMLINKS=true
    ```

    Then, restart Riven. Be sure to set `FIX_SYMLINKS` back to `false` after the repair is complete.


Alternatively, you can also set the symlink repair option from the Riven settings, and just lower the interval to 1 hour.

----