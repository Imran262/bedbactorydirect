export default {
  methods: {
    addressLookUpFinder () {
      console.log('addressLookUpFinder')
      const crafty_addressLookup_args = document.createElement('script')
      crafty_addressLookup_args.type = `text/javascript`;
      crafty_addressLookup_args.id = `clickToAddressId`;
      crafty_addressLookup_args.innerHTML = `
        var cc_object = new clickToAddress({
          accessToken: '0e44f-0957c-c6983-06676',
          showLogo: false,
          defaultCountry: 'gbr',
          getIpLocation: false,
          countrySelector: false
        });
        cc_object.attach({
          search:'postcode',
          line_1:'street-address',
          company:'company-name'
        },{
          onResultSelected: function(c2a, elements, address){
            console.log('Selected Call', address);
            if (document && document.getElementsByName('street-address') && document.getElementsByName('street-address')  !== 'null' && document.getElementsByName('street-address').length > 0 ) {
              document.getElementsByName('street-address')[0].value = address.line_1 + ' ' + address.line_2;
            }
            if (document && document.getElementById('city') && document.getElementById('city') !== 'null') {
              document.getElementById('city').value = address.locality;
            }
            if (document && document.getElementById('find_address_manuall') && document.getElementById('find_address_manuall') !== 'null') {
              document.getElementById('find_address_manuall').value = address.postal_code;
            }
            if (document && document.getElementsByName('company-name') && document.getElementsByName('company-name')  !== 'null' && document.getElementsByName('company-name').length > 0 ) {
              document.getElementsByName('company-name')[0].value = address.company_name;
            }
            if (document && document.getElementsByName('city') && document.getElementsByName('city')  !== 'null' && document.getElementsByName('city').length > 0 ) {
              document.getElementsByName('city')[0].value = address.locality;
            }
            if (document && document.getElementsByName('zip-code') && document.getElementsByName('zip-code')  !== 'null' && document.getElementsByName('zip-code').length > 0 ) {
              document.getElementsByName('zip-code')[0].value = address.postal_code;
              document.getElementById("find-address").click();
            }
            document.getElementById("enter-address").click();
            if (document && document.getElementsByName('postcode') && document.getElementsByName('postcode')  !== 'null' && document.getElementsByName('postcode').length > 0 ) {
              document.getElementsByName('postcode')[0].value = '';
            }
          }
        });
      `
      document.body.appendChild(crafty_addressLookup_args)
    }
  }
}
