require('dotenv').config();
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('./rpc.proto', {
  keepCase: true
});
const lnrpc = grpc.loadPackageDefinition(packageDefinition).lnrpc;

process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA';
var lndCert = Buffer.from(process.env.LND_CERT, 'utf8');
var sslCreds = grpc.credentials.createSsl(lndCert);

var macaroonCreds = grpc.credentials.createFromMetadataGenerator(function(args, callback) {
  var macaroon = process.env.LND_MACAROON;
  var metadata = new grpc.Metadata();
  metadata.add('macaroon', macaroon);
  callback(null, metadata);
});

var creds = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);
var lightning = new lnrpc.Lightning('localhost:10009', creds);

var getInfo = () => {
  var request = {};
  lightning.getInfo(request, function(err, response) {
    console.log(response);
  });
};

var newAddress = () => {
  var request = {
    type: ''
  };
  lightning.newAddress(request, function(err, response) {
    console.log(response);
  });
};

var walletBalance = () => {
  request = {};
  lightning.walletBalance(request, function(err, response) {
    console.log(BigInt(response.total_balance).toString());
  });
};

var connectPeer = () => {
  var request = {
    //this is addr test

    addr: {
      pubkey: '03c5a180fe2d2805dc82065ba4656613c32b4adfb4200bdb52d01a593b3ff080ae',
      host: 'localhost:10012'
    },
    perm: true
  };
  lightning.connectPeer(request, function(err, response) {
    console.log(response);
  });
};

var listPeers = () => {
  var request = {};
  lightning.listPeers(request, function(err, response) {
    console.log(response);
  });
};

var openChannel = () => {
  // this is pubkey test
  var pubkey = '02d61e6b1e69f56e1be75fc270abdb9daade494df32ce4b7bb008a0caed5e4bb3c';
  var request = {
    node_pubkey_string: pubkey,
    local_funding_amount: 1000000,
    push_sat: 0,
    target_conf: 1,
    private: false,
    min_confs: 3,
    spend_unconfirmed: false
  };
  lightning.openChannelSync(request, function(err, response) {
    console.log(response);
  });
};

var channelBalance = () => {
  var request = {};
  lightning.channelBalance(request, function(err, response) {
    console.log(response);
  });
};

var listChannel = () => {
  var request = {
    active_only: true
  };
  lightning.listChannels(request, function(err, response) {
    console.log(response);
  });
};

var addInvoice = () => {
  var request = {
    amt_paid: 50000
  };
  lightning.addInvoice(request, function(err, response) {
    console.log(response);
  });
};

var sendPayment = () => {
  var request = {
    // dest: <bytes>,
    // dest_string: <string>,
    // amt: <int64>,
    // payment_hash: <bytes>,
    // payment_hash_string: <string>,
    payment_request:
      'lnsb10u1pwuukn8pp54v3xgpv84k8du9l00j8dc0lj7rg5qqc2vpk7496tlm8zv2uyxausdqqcqzpg8tx8z98t8vlvgv5cx9wdc7ch65puxf7e43zgaj3gyu2whvr9rwexe9nns82rpruawr79nraztg0chcg9y5zu8zyagysuvp77k2tjzngq9sezqz'
    // final_cltv_delta: <int32>,
    // fee_limit: <FeeLimit>,
    // outgoing_chan_id: <uint64>,
    // cltv_limit: <uint32>,
    // dest_tlv: <array DestTlvEntry>,
  };
  lightning.sendPaymentSync(request, function(err, response) {
    console.log(response);
  });
};

var closeChannel = () => {
  var request = {
    channel_point: {
      funding_txid_str: 'f7b8c3536f38a6e7b9429a0be075e3b4f656dc7c4972af63c057a4e361e6f87b',
      output_index: 0
    }
  };
  var call = lightning.closeChannel(request);
  call.on('data', function(response) {
    console.log(response);
  });
};

var channalBalance = () => {
  var request = {};
  lightning.channelBalance(request, function(err, response) {
    console.log(response);
  });
};

// getInfo();
// walletBalance();
// newAddress();
listPeers();
// connectPeer();
// listChannel();
// openChannel();
// addInvoice();
// sendPayment();
// channelBalance();
// closeChannel();

//02b91a3e09cc9e207aea58a6a172b94fd6946cc7f364b13b9419c17fee56b6dca1 alice
//02d61e6b1e69f56e1be75fc270abdb9daade494df32ce4b7bb008a0caed5e4bb3c bob
module.exports = {
  getInfo,
  walletBalance,
  newAddress,
  listPeers,
  connectPeer,
  listChannel,
  openChannel,
  addInvoice,
  sendPayment,
  channelBalance,
  closeChannel
};