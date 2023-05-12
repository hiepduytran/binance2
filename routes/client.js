
module.exports = function (app, obj, binance, binanceSend) {
        
    binanceSend.futuresMiniTickerStream('BTCUSDT', (data) => {
        var close = data.close;
        binance.fetchBalance().then(function (data) {
                var total = data.total;
                var btc = total.BTC;
                var usdt = total.USDT;
                var totalUSDT = (total.BTC - 1) * close + total.USDT;
                // console.log(btc + " " + usdt + " " + totalUSDT);
                app.io.sockets.emit("server-send-btc", total.BTC);
                app.io.sockets.emit("server-send-usdt", total.USDT);
                app.io.sockets.emit("server-send-total", totalUSDT);
            }
        );
    });

    app.get("/off", function (req, res) {
        console.log("Bot is ended!");
        require('../bot')("off", 0.01);
        res.render("master");
    });

    app.get("/on/:amount", function (req, res) {
        var quantity = parseFloat(req.params.amount);
        console.log("Bot is running!");
        require('../bot')("on", quantity);
        res.render("master");
    });

    app.get("/", function (req, res) {
        res.render("master");
    });
}



