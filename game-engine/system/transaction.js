/**
 * @namespace
 */
cwt.transaction = {

  /**
   * Holds the transaction functions.
   *
   * @private
   */
  _transactions: {},

  /**
   * Registers a function as transaction. A transaction must be atomic, means if it will be called on two different
   * machines with the same data, then it must produce the same output.
   *
   * @param mKey module key
   * @param fKey function key
   */
  registerTransaction: function( mKey, fKey ){
    var tKey = mKey+"."+fKey;

    // TODO maybe look into the function source to find Math.random() or something like that (prevent atomic faults)

    this._transactions[ tKey ] = {
      mod: cwt[ mKey ],
      fn: cwt[ mKey ][ fKey ]
    };

    // replace function on module with a function that
    // shares the call and registers the call in the
    // message pipe
    //  --> be transparent
    cwt[ mKey ][ fKey ] = function(){

      //TODO share it

      cwt.messageBuffer.pushMsg({
        k: tKey,
        a: arguments
      });
    }
  },

  /**
   * Every remote call should be done via a transaction message. The transaction message can only call
   * registered transaction if it will be evaluated with this function. This should prevent a call of
   * forbidden or non-atomic functions from other clients.
   *
   * @param msg
   */
  evalTransactionMessage: function( msg ){
    var ta = this._transactions[ msg.k ];
    ta.fn.apply( ta.mod, msg.a );
  }
};