const Razorpay = require('razorpay');
const axios = require('axios');

class RazorpayService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  /**
   * Bank Account Verification
   */
  async verifyBankAccount(details) {
    console.log('[RAZORPAY SDK] Initiating Bank Validation for:', details.accountNumber);
    try {
      // 1. Create a Customer
      const customer = await this.razorpay.customers.create({
        name: details.accountHolderName || 'Verification User',
        email: 'test' + Date.now() + '@mlx.com',
        contact: '9999999999',
        reference_id: 'val_' + Date.now()
      });

      // 2. Create the Fund Account associated with this Customer
      const fundAccount = await this.razorpay.fundAccount.create({
        customer_id: customer.id,
        account_type: 'bank_account',
        bank_account: {
          name: details.accountHolderName || 'Verification User',
          ifsc: details.ifscCode,
          account_number: details.accountNumber
        }
      });

      console.log('[RAZORPAY SDK] Fund Account Generated successfully:', fundAccount.id);

      return {
        status: 'verified',
        registeredName: details.accountHolderName,
        referenceId: fundAccount.id
      };
    } catch (error) {
      console.error('[RAZORPAY SDK FAIL] Validation Error:', error);
      throw new Error('Bank verification failed via Razorpay Integration');
    }
  }

  /**
   * Automated Payout Execution
   */
  async triggerPayout(details, amount) {
    console.log(`[RAZORPAY SDK] Triggering Live Payout of ₹${amount} to ${details.accountNumber}`);
    try {
      const customer = await this.razorpay.customers.create({
        name: details.accountHolderName || 'Payout User',
        email: 'payout' + Date.now() + '@mlx.com',
        contact: '9999999999',
        reference_id: 'pout_' + Date.now()
      });

      const fundAccount = await this.razorpay.fundAccount.create({
        customer_id: customer.id,
        account_type: 'bank_account',
        bank_account: {
          name: details.accountHolderName || 'Payout User',
          ifsc: details.ifscCode,
          account_number: details.accountNumber
        }
      });

      // Execute Direct REST Request
      const authHeader = 'Basic ' + Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
      
      try {
        const response = await axios.post('https://api.razorpay.com/v1/payouts', {
          account_number: '2323230045173715',
          fund_account_id: fundAccount.id,
          amount: amount * 100, // paise
          currency: 'INR',
          mode: 'IMPS',
          purpose: 'payout',
          queue_if_low_balance: true
        }, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        });
        
        return {
          id: response.data.id,
          status: response.data.status, 
          amount: response.data.amount, 
          currency: 'INR'
        };
      } catch (innerError) {
        // Extract the explicit exact Razorpay network error
        const errorMessage = innerError.response && innerError.response.data && innerError.response.data.error 
          ? innerError.response.data.error.description 
          : innerError.message;
        
        console.error('[RAZORPAY REST ERROR]', errorMessage);
        throw new Error(errorMessage);
      }

    } catch(error) {
      console.error('[RAZORPAY SDK FAIL] Payout sequence failed:', error.message);
      throw new Error(error.message || 'Automated payout failed to initialize');
    }
  }
}

module.exports = new RazorpayService();
