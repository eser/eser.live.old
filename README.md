# eser.live

[![GitHub issues](https://img.shields.io/github/issues/eser/eser.live)](https://github.com/eser/eser.live/issues)

(For English please click [here](README.en.md))

## Proje Açıklaması

Henüz hazır değil.

## Teknoloji

Projelerimizi oluşturmak için kullandığımız teknolojiler şunlardır:

Frontend için:

- [Fresh](https://fresh.deno.dev)
- [Shadcn](https://shadcn/ui)
- [Supabase](https://supabase.io)

Backend için:

- [Supabase](https://supabase.io)
- [Prisma](https://prisma.io)

Önceden kurulu olması gerekenler:

- [Deno](https://deno.land) (önerilen v1.35.2)
- [Git](https://git-scm.com/) (önerilen v2.41.0)

## Projeyi Ayağa Kaldırma

GitHub repository'sini klonlayın:

```bash
$ git clone git@github.com:eser/eser.live.git
```

Proje dizinine gidin:

```bash
$ cd eser.live
```

Gerekli paketleri yükleyin:

```bash
$ pnpm install
```

API klasörüne gidip Supabase'i konfigure edin:

```bash
$ cd packages/api
$ pnpx supabase start

Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: aaa.bbb.ccc_ddd0
service_role key: xxx.yyy.zzz-www
```

Hem `packages/api` hem de `packages/web` dizinlerindeki `.env` dosyalarını
`.env.local` olarak kopyalayın ve gerekli değişiklikleri yapın.

Halen `packages/api` klasöründeyken gidip veritabanınızdaki tabloları oluşturun
ve birkaç örnek veri ekleyin:

```bash
$ pnpm db:generate
$ pnpm db:push
$ pnpm db:seed
```

Son olarak, ana dizine geri dönün ve projeyi geliştirme modunda başlatın:

```bash
$ cd ../..
$ pnpm dev
```

## Proje Yönetimi

Şu anda projeye ait bir yönetim panelimiz bulunmamakta. İşlemleri bu nedenle CLI
üzerinden yapmaktayız. Sisteminizde `deno` kurulu ise, aşağıdaki komutlar
aracılığı ile CLI'a erişebilirsiniz:

```bash
$ cd packages/api
$ deno task cli
```

CLI üzerinden `env` ve `supabase` nesnelerine erişebilirsiniz.

### Örnekler:

Profil getirme:

```js
await profileGet(supabase, "eser", "tr");
```

## Nasıl Katkıda Bulunabilirsin?

Herkesten katkı bekliyoruz. Başlamak için lütfen
[katkıda bulunma kılavuzumuzu](CONTRIBUTING.md) okuyun. Yardım etmek isterseniz
[issue'lara](https://github.com/eser/eser.live/issues) göz atabilirsiniz.
Herhangi bir sorunuz varsa ve/veya herhangi bir noktada takıldıysanız GitHub
Issues üzerinden yardım istemekten çekinmeyin.

## Lisans

Apache 2.0, detaylar için [LICENSE](LICENSE) dosyasını inceleyebilirsiniz.
