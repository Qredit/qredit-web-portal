var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Qredit Web Portal",
    routename: "home",
    csrfToken: req.csrfToken()
  });
});

/* GET wallet page. */
router.get("/wallet/testwallet", function (req, res, next) {
  res.render("wallet/testwallet", {
    title: "Test Wallet",
    routename: "testwallet",
    csrfToken: req.csrfToken()
  });
});

router.get("/wallet/create", function (req, res, next) {
  res.render("wallet/create", {
    title: "create",
    routename: "create",
    csrfToken: req.csrfToken()
  });
});
router.get("/wallet/import", function (req, res, next) {
  res.render("wallet/import", {
    title: "import",
    routename: "import",
    csrfToken: req.csrfToken()
  });
});
router.get("/wallet/rename", function (req, res, next) {
  res.render("wallet/rename", {
    title: "rename",
    routename: "rename",
    csrfToken: req.csrfToken()
  });
});
router.get("/wallet/delete", function (req, res, next) {
  res.render("wallet/delete", {
    title: "delete",
    routename: "delete",
    csrfToken: req.csrfToken()
  });
});

/* GET explorer page. */
router.get("/explorer/transactions", function (req, res, next) {
  res.render("explorer/transactions", {
    title: "Transactions",
    routename: "transactions",
    csrfToken: req.csrfToken()
  });
});
router.get("/explorer/tokenlist", function (req, res, next) {
  res.render("explorer/tokenlist", {
    title: "Token List",
    routename: "tokenlist",
    csrfToken: req.csrfToken()
  });
});
router.get("/explorer/peers", function (req, res, next) {
  res.render("explorer/peers", {
    title: "Peers",
    routename: "peers",
    csrfToken: req.csrfToken()
  });
});
router.get("/explorer/topwallets", function (req, res, next) {
  res.render("explorer/topwallets", {
    title: "Top Wallets",
    routename: "topwallets",
    csrfToken: req.csrfToken()
  });
});
router.get("/explorer/delegatesmonitor", function (req, res, next) {
  res.render("explorer/delegatesmonitor", {
    title: "Delegates Monitor",
    routename: "delegatesmonitor",
    csrfToken: req.csrfToken()
  });
});

/* GET tools page. */
router.get("/tools/bulksender", function (req, res, next) {
  res.render("tools/bulksender", {
    title: "Qredit Bulk Sender",
    routename: "bulksender",
    csrfToken: req.csrfToken()
  });
});
router.get("/tools/delegateapp", function (req, res, next) {
  res.render("tools/delegateapp", {
    title: "Delegate App",
    routename: "delegateapp",
    csrfToken: req.csrfToken()
  });
});
router.get("/tools/desktopapp", function (req, res, next) {
  res.render("tools/desktopapp", {
    title: "Desktop App",
    routename: "desktopapp",
    csrfToken: req.csrfToken()
  });
});
router.get("/tools/generator", function (req, res, next) {
  res.render("tools/generator", {
    title: "QAE Generator",
    routename: "generator",
    csrfToken: req.csrfToken()
  });
});
router.get("/tools/mobileapp", function (req, res, next) {
  res.render("tools/mobileapp", {
    title: "Qredit Mobile App",
    routename: "mobileapp",
    csrfToken: req.csrfToken()
  });
});
router.get("/tools/paperwallet", function (req, res, next) {
  res.render("tools/paperwallet", {
    title: "Paper Wallet",
    routename: "paperwallet",
    csrfToken: req.csrfToken()
  });
});
router.get("/tools/qds", function (req, res, next) {
  res.render("tools/qds", {
    title: "Qredit Data Server",
    routename: "qds",
    csrfToken: req.csrfToken()
  });
});
router.get("/tools/voting", function (req, res, next) {
  res.render("tools/voting", {
    title: "Voting",
    routename: "voting",
    csrfToken: req.csrfToken()
  });
});

/* GET docs page. */
router.get("/docs/apidocs", function (req, res, next) {
  res.render("docs/apidocs", {
    title: "API Docs",
    routename: "apidocs",
    csrfToken: req.csrfToken()
  });
});
router.get("/docs/docsdelegates", function (req, res, next) {
  res.render("docs/docsdelegates", {
    title: "Delegate Documentation",
    routename: "docsdelegates",
    csrfToken: req.csrfToken()
  });
});
router.get("/docs/exchangeintegration", function (req, res, next) {
  res.render("docs/exchangeintegration", {
    title: "Exchange Integration",
    routename: "exchangeintegration",
    csrfToken: req.csrfToken()
  });
});
router.get("/docs/libraries", function (req, res, next) {
  res.render("docs/libraries", {
    title: "Libraries",
    routename: "libraries",
    csrfToken: req.csrfToken()
  });
});
router.get("/docs/nodemanagement", function (req, res, next) {
  res.render("docs/nodemanagement", {
    title: "Node Management",
    routename: "nodemanagement",
    csrfToken: req.csrfToken()
  });
});
router.get("/docs/parameters", function (req, res, next) {
  res.render("docs/parameters", {
    title: "Blockchain Parameters",
    routename: "parameters",
    csrfToken: req.csrfToken()
  });
});
router.get("/docs/qaeintegration", function (req, res, next) {
  res.render("docs/qaeintegration", {
    title: "QAE Integration",
    routename: "qaeintegration",
    csrfToken: req.csrfToken()
  });
});
/* GET exchanges page. */
router.get("/exchanges", function (req, res, next) {
  res.render("exchanges", {
    title: "Exchanges",
    routename: "exchanges",
    csrfToken: req.csrfToken()
  });
});
/* GET blog page. */
router.get("/blog", function (req, res, next) {
  res.render("blog", {
    title: "Blog",
    routename: "blog",
    csrfToken: req.csrfToken()
  });
});

/* Explorer URL Parameter routes*/

router.get("/explorer/transaction/:transactionId", function (req, res, next) {
  res.render("explorer/transaction", {
    title: "Transaction Details",
    routename: "transaction",
    transactionId: req.params.transactionId,
    csrfToken: req.csrfToken()
  });
});

router.get("/explorer/wallet/:walletId", function (req, res, next) {
  res.render("explorer/wallet", {
    title: "Wallet Details",
    routename: "sender",
    walletId: req.params.walletId,
    csrfToken: req.csrfToken()
  });
});

router.get("/explorer/token/:tokenid", function (req, res, next) {
  res.render("explorer/token", {
    title: "Token Details",
    routename: "token",
    tokenid: req.params.tokenid,
    csrfToken: req.csrfToken()
  });
});



module.exports = router;