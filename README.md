# get-dlsite-favorites

[DLsite](https://www.dlsite.com/)のお気に入り一覧のうち、割引している商品をピックアップしカレントディレクトリの `data.json` に書きだします。  
From the favorite list of [DLsite](https://www.dlsite.com/), pick up the discounted product and write it to `data.json` in the current directory.

## Requirements

- NodeJS (Tested with `v15.4.0`)
- NPM (Tested with `v7.0.15`)

## Installation

`git clone https://github.com/book000/get-dlsite-favorites.git`

## Configuration

`config.json` に書き込んで設定します。

```json
{
    "username": "USERNAME",
    "password": "PASSWORD"
}
```

- `username`: DLsiteのユーザー名
- `password`: DLsiteのパスワード

## Usage

1. `npm i`
2. `npm run build`
3. Edit `config.json`
4. `node out\main.js`
5. View `data.json`

## Disclaimer

このプロジェクトを使用したことによって引き起こされた問題に関して開発者は一切の責任を負いません。  
The author is not responsible for any problems caused by the user using this project.

## License

このプロジェクトのライセンスは[MIT License](LICENSE)です。  
The license for this project is [MIT License](LICENSE).
