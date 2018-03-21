App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    console.log("displaying");
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      console.log("this");
      App.web3Provider = web3.currentProvider;
    } else {
  // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
      web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    // var mabi = JSON.stringify();
    // var pabi = JSON.stringify();
    // var labi = JSON.stringify();
    var marketABI = JSON.parse('{"type":"event","name":"AuctionSuccessful","inputs":[{"name":"id","type":"bytes32","indexed":false},{"name":"assetId","type":"uint256","indexed":true},{"name":"seller","type":"address","indexed":true},{"name":"totalPrice","type":"uint256","indexed":false},{"name":"winner","type":"address","indexed":true}],"anonymous":false}');
    var proxyABI = JSON.parse('{"type":"function","name":"currentContract","constant":true,"payable":false,"stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"address"}]}');
    var landABI = JSON.parse('{"type":"function","name":"decodeTokenId","constant":true,"payable":false,"stateMutability":"view","inputs":[{"name":"value","type":"uint256"}],"outputs":[{"name":"","type":"int256"},{"name":"","type":"int256"}]}');
    var Market = web3.eth.contract(marketABI);
    var Prox = web3.eth.contract(proxyABI);
    var Land = web3.eth.contract(landABI);

    var MarketInstance = Market.at('0xb3bca6f5052c7e24726b44da7403b56a8a1b98f8');
    var ProxyInstance = Prox.at('0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d');
    var LandInstance = Market.at(ProxyInstance.currentContract().call());

    var sellEvent = MarketInstance.AuctionSuccessful({}, {fromBlock: 0, toBlock: 'latest'});

    sellEvent.get(function(error, logs) {
      if (!error) {
        var table = document.getElementById("txTable");
        for (i = 0; i < logs.length; i++) {
          var row = table.insertRow(0);
          var land = row.insertCell(0);
          var price = row.insertCell(1);
          var sold = row.insertCell(2);
          var bought = row.insertCell(3);

          var landId = logs.args[1];
          var _land = LandInstance.decodeTokenId(landId);
          var _price = web3.fromWei(logs.args[3], ether);
          var _sold = logs.args[2];
          var _bought = logs.args[4];

          land.innerHTML = "(" + _land[0].toString() + "," + _land[1].toString() + ")";
          price.innerHTML = _price;
          sold.innerHTML = _sold;
          bought.innerHTML = _bought;
        }
      }
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    /*
     * Replace me...
     */
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */
  },

  buildChart: function(prices) {
    var points = [];
    for (i = 0; i < prices.length; i++) {
      points[i] = "{" + i + "," + parseInt(prices[i]) + " }";
    }
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawBackgroundColor);

    function drawBackgroundColor() {
      var data = new google.visualization.DataTable();
      data.addColumn('number', 'Sale');
      data.addColumn('number', 'Price');
      data.addRows(points);
    }
    var options = {
        hAxis: {
          title: 'Sale'
        },
        vAxis: {
          title: 'Price (MANA)'
        },
        backgroundColor: '#f1f8e9'
      };
      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  }
};

$(function() {
  $(window).load(function() {
    console.log("display");
    App.init();
  });
});
