
from bigchaindb_driver import BigchainDB
from bigchaindb_driver.crypto import generate_keypair
bdb_root_url = 'https://bigchaindb.ppls.cf:9984'
def open_connection(url):
    return BigchainDB(url)

def prepare_tx(bdb,user,data_tx,metadata_tx):
    return bdb.transactions.prepare(
    operation='CREATE',
    signers=user.public_key,
    asset=data_tx,
    metadata=metadata_tx)

# fulfill and send the transaction
def fulfill_tx(bdb,user,prepared_token_tx):
    return bdb.transactions.fulfill(
    prepared_token_tx,
    private_keys=user.private_key)

def send_tx(bdb, fulfilled_token_tx):
    data = json.loads((request.data).decode('utf-8').replace("'",'"').replace('\\n',''))
    bdb = open_connection(url)
    user = generate_keypair()
    prepared_token_tx = prepare_tx(bdb,user,data['data_tx'],data['metadata_tx'])
    fulfilled_token_tx = fulfill_tx(bdb,user,prepared_token_tx)

    return bdb.transactions.send_commit(fulfilled_token_tx)
