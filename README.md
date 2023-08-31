# eser.live

[![GitHub issues](https://img.shields.io/github/issues/eser/eser.live)](https://github.com/eser/eser.live/issues)

(For English please click [here](README.en.md))

## Proje Açıklaması

Henüz hazır değil.

## Teknoloji

Projelerimizi oluşturmak için kullandığımız teknolojiler şunlardır:

Frontend için:

- [cool lime](https://coollime.deno.dev)
- [Shadcn](https://shadcn/ui)
- [PostCSS](https://postcss.org)

Backend için:

- [Deno](https://deno.com)
- [Deno KV](https://deno.com/kv)

Önceden kurulu olması gerekenler:

- [Deno](https://deno.land) (önerilen v1.36.2)
- [Git](https://git-scm.com) (önerilen v2.41.0)
- [Pup](https://github.com/Hexagon/pup) (önerilen v1.0.0-rc.7)

## Projeyi Ayağa Kaldırma

GitHub repository'sini klonlayın:

```bash
$ git clone git@github.com:eser/eser.live.git
```

Proje dizinine gidin:

```bash
$ cd eser.live
```

Konfigurasyonu tamamlayın:

Hem `pkg/api` hem de `pkg/web` dizinlerindeki `.env` dosyalarını `.env.local`
olarak kopyalayın ve gerekli değişiklikleri yapın.

Halen `pkg/api` klasöründeyken gidip veritabanınızdaki tabloları oluşturun ve
birkaç örnek veri ekleyin:

```bash
$ deno task generate
```

Son olarak, ana dizine geri dönün ve projeyi geliştirme modunda başlatın:

```bash
$ pup start
```

## Proje Yönetimi

Şu anda projeye ait bir yönetim panelimiz bulunmamakta. İşlemleri bu nedenle CLI
üzerinden yapmaktayız. Sisteminizde `deno` kurulu ise, aşağıdaki komutlar
aracılığı ile CLI'a erişebilirsiniz:

```bash
$ deno task api:cli
```

CLI üzerinden `env`, `seed`, `profileGet`, vb. öntanımlı nesnelere
erişebilirsiniz.

### Örnekler:

Profil getirme:

```js
await profileGet("eser", "tr");
```

## Nasıl Katkıda Bulunabilirsin?

Herkesten katkı bekliyoruz. Başlamak için lütfen
[katkıda bulunma kılavuzumuzu](CONTRIBUTING.md) okuyun. Yardım etmek isterseniz
[issue'lara](https://github.com/eser/eser.live/issues) göz atabilirsiniz.
Herhangi bir sorunuz varsa ve/veya herhangi bir noktada takıldıysanız GitHub
Issues üzerinden yardım istemekten çekinmeyin.

## Lisans

Apache 2.0, detaylar için [LICENSE](LICENSE) dosyasını inceleyebilirsiniz.
