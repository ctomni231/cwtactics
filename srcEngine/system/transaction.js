
/**
 * Holds the transaction functions.
 *
 * @private
 */
cwt._transactions = {};

/**
 * Registers a function as transaction. A transaction must be atomic, means
 * if it will be called on two different machines with the same data, then it
 * must produce the same output.
 *
 * @param mKey module key
 * @param fKey function key
 */
cwt.registerTransaction = cwt.transaction = function( fKey ){

  // TODO maybe look into the function source to find Math.random() or
  // TODO something like that (prevent atomic faults)

  cwt._transactions[ fKey ] = cwt[ fKey ];

  // replace function on module with a function that
  // shares the call and registers the call in the
  // message pipe
  //  --> be transparent
  cwt[ fKey ] = function(){

    // TODO share it

    cwt.pushMsgToBuffer({
      k: fKey,
      a: arguments
    });
  }
};

/**
 * Every remote call should be done via a transaction message. The transaction
 * message can only call registered transaction if it will be evaluated with
 * this function. This should prevent a call of forbidden or non-atomic
 * functions from other clients.
 *
 * @param msg
 */
cwt.evalTransactionMessage = function( msg ){
  var fn = cwt._transactions[ msg.k ];
  fn.apply( cwt, msg.a );
};