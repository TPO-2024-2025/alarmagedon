# Home Assistant v okolju Docker

Za vzpostavitev lokalne postavitve **Home Assistant** v Docker okolju uporabite ukaz:

```{bash}
docker compose up -d
```

Home Assistant je nato na voljo na naslovu <http://localhost:8123/>.

Za pregled dnevniških zapisov uporabite ukaz:

```{bash}
docker compose logs -f
```

Za zaustavitev uporabite ukaz:

```{bash}
docker compose down
```
