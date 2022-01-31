<template>
  <div class="outer_border">
    <div
      class="quoter-container"
      v-for="(quoteVal, index) in quoteData"
      :key="index"
    >
      <div class="heading latestHeading" v-if="quoteVal.items">
        <template v-if="quoteVal.quote_number == firstQuoteId">
          Your Latest Quote
        </template>
        <template v-else> Quote {{ quoteVal.quote_number }} </template>
      </div>
      <div class="quote-inner-container" v-if="quoteVal.items">
        <div class="text">
          Hello
          <template v-if="quoteVal.customer_firstname">
            {{ quoteVal.customer_firstname }}
          </template>
          <template v-if="quoteVal.customer_middlename">
            {{ quoteVal.customer_middlename }}
          </template>
          <template v-if="quoteVal.customer_lastname">
            {{ quoteVal.customer_lastname }},
          </template>
        </div>
        <div class="new_quote">
          <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <div
                v-if="quoteVal.quote_number == firstQuoteId"
                class="text_one"
              >
                You Have <span class="clr">{{ quoteData.length }}</span> new
                Quote(s).
              </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <div class="text_one txr">
                Quote No:
                <span class="txr1"> {{ quoteVal.quote_number }} </span>
              </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <div class="text_one txr">
                Expiry Date:
                <span class="txr1">{{ expiryDate(quoteVal.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="new_quote1">
          <table>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Product Name</th>
                <th scope="col">Price</th>
                <th scope="col">Qty</th>
                <th class="right-align" scope="col">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(itemsVal, itemsIndex) in quoteVal.items"
                :key="itemsIndex"
              >
                <td scope="row">
                  <img
                    class="center quote-image"
                    :src="getQuoteProdImage(itemsVal.image)"
                    alt="quoteimage"
                  />
                </td>
                <td data-label="Name">
                  {{ itemsVal.name }}
                </td>
                <td data-label="price">
                  {{ itemsVal.price_incl_tax | price(storeView) }}
                </td>
                <td data-label="Quantity">{{ itemsVal.items.qty }}</td>
                <td class="right-align" data-label="Subtotal">
                  {{ itemsVal.row_total_incl_tax | price(storeView) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p_right">
          <div class="row">
            <div class="col-lg-7 col-md-7 col-sm-7 col-xs-2"></div>
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-7">
              <p class="bold">Subtotal</p>
              <p class="bold">Discount</p>
              <p class="bold">Delivery</p>
              <p class="bold">Grand Total Inc VAT</p>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-3">
              <p class="align_right">
                {{ quoteVal.base_grand_total | price(storeView) }}
              </p>
              <p class="align_right">
                {{ quoteVal.discount_amount | price(storeView) }}
              </p>
              <p class="align_right">
                {{ quoteVal.delivery | price(storeView) }}
              </p>
              <p class="align_right">
                {{ quoteVal.base_grand_total | price(storeView) }}
              </p>
            </div>
          </div>
        </div>
        <div class="row p20 botom-space">
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 quote-back-button">
            <router-link
              to="/my-account/orders"
              data-v-fab91130=""
              data-v-e79937e8=""
              type="button"
              data-testid="addToCart"
              class="
                back-button
                no-outline
                button_left button-full
                brdr-none
                w-100
                px10
                py15
                :bg-cl-th-secondary
                ripple
                weight-400
                h4
                cl-white
                sans-serif
                fs-medium
                add-btn
              "
            >
              Back
            </router-link>
          </div>
          <div
            class="col-lg-6 col-md-6 col-sm-6 col-xs-12 qoute-addtocart-button"
          >
            <template
              v-if="
                quoteVal.order_entity_id && quoteVal.order_entity_id !== null
              "
            >
              <router-link
                :to="{
                  path: '/my-account/orders/' + quoteVal.order_entity_id,
                  query: {},
                }"
                class="
                  f_right f_right_vieworder
                  button_right
                  no-outline
                  button-full
                  block
                  brdr-none
                  w-100
                  px10
                  py20
                  :bg-cl-th-secondary
                  ripple
                  weight-400
                  h4
                  cl-white
                  sans-serif
                  fs-medium
                  add-btn
                "
              >
                {{ "View Order" }}
              </router-link>
            </template>
            <template v-else>
              <button
                data-v-fab91130=""
                data-v-e79937e8=""
                type="button"
                data-testid="addToCart"
                class="
                  f_right
                  button_right
                  no-outline
                  button-full
                  block
                  brdr-none
                  w-100
                  px10
                  py15
                  :bg-cl-th-secondary
                  ripple
                  weight-400
                  h4
                  cl-white
                  sans-serif
                  fs-medium
                  add-btn
                "
                @click="quoteAddToCart(quoteVal.quote_number,index)"
              >
                Add to BASKET
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateFormat from 'dateformat';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import MyProfile from '@vue-storefront/core/compatibility/components/blocks/MyAccount/MyProfile';
import { mapGetters } from 'vuex';
import { getThumbnailPath } from '@vue-storefront/core/helpers';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import i18n from '@vue-storefront/i18n';
import { CartService } from '@vue-storefront/core/data-resolver';
import axios from "axios";
import config from 'config'

export default {
  Name: 'Quotations',
  data () {
    return {
      quoteData: [],
      firstQuoteId: null
    };
  },
  mixins: [MyProfile],
  async mounted () {
    await this.$store
      .dispatch('quotesystem/quoteSystemFunction', {
        customerId: this.currentUser.id
      })
      .then(resp => {
        console.log('1122 response is ', resp);
        const firstQuote = resp[Object.keys(resp)[0]];
        this.firstQuoteId = firstQuote.entity_id;
        this.quoteData = resp;

        let convertedOrder = [];
        for (var prop in resp) {
          if (resp.hasOwnProperty(prop)) {
            convertedOrder.push(resp[prop].converted_order);
          }
        }
      })
      .catch(err => {
        console.log('err occured from api call', err);
      });
  },
  computed: {
    ...mapGetters({
      getCartToken: 'cart/getCartToken',
      getUserToken: 'user/getToken'
    }),
    storeView () {
      return currentStoreView();
    }
  },
  methods: {
    expiryDate (date) {
      const d = new Date(date.replace(' ', 'T'));
      d.setDate(d.getDate() + 30);
      const finalDate = dateFormat(d, 'dd-mm-yyyy');
      return finalDate;
    },
    getQuoteProdImage (slug) {
      return getThumbnailPath(slug, 186, 186);
    },
    async addQuotebasic () {
      let product = {
        id: '452',
        attribute_set_id: '4',
        type_id: 'simple',
        sku: 'cavali-divan-bed',
        has_options: '1',
        required_options: '1',
        created_at: '2020-05-06 12:30:13',
        updated_at: '2022-01-14 06:42:06',
        status: '1',
        visibility: '4',
        stock: {
          is_in_stock: true,
          qty: 10000000
        },
        tax_class_id: '2',
        product_type_1: '25',
        brand: '34',
        shipping_group: '1',
        isFabric: '1',
        isFabrics: '0',
        swatches_sample_product: '0',
        total_reviews: '48',
        average_score: '4',
        isStock: '0',
        product_label: '1',
        fragrance: '309',
        description:
          '<p>The Cavali divan bed is a smart, modern divan with both a comfortable mattress and an attractive looking base. The mattress of this bed is a traditional sprung mattress finished in a quilted damask fabric. The mattress is hand tufted, making the fillings densely packed and adding extra durability to your mattress.</p>\n<p>The base of the Cavali divan is available in a choice of modern chenille fabrics, giving you great flexibility if you need the bed to fit into a particular colour scheme. You can also add storage options to the base if you could benefit from the extra space in keeping your bedroom neat and tidy.</p>\n<p>The bed photographed is upholstered in Wool Steel fabric with our <span style="text-decoration: underline;"><a href="https://bedfactorydirect.co.uk/coniston-22-chenille-headboard">Coniston headboard</a></span>. Don\'t forget to add the headboard to your basket to complete the look of your new Divan.</p>',
        short_description:
          '<ul>\n<li>Medium Firmness</li>\n<li>Hand Tufted</li>\n<li>Turnable</li>\n<li>Choice Of Colours</li>\n<li>Storage Options</li>\n</ul>',
        meta_keyword: 'Sleepover Divan Bed',
        specs:
          '<p><strong>Divan Size</strong></p>\n<ul>\n<li>Single - (3\'0" x 6\'3") / (90 x 190cm)</li>\n<li>Small Double - (4\'0" x 6\'3") / (120 x 190cm)</li>\n<li>Double - (4\'6" x 6\'3") / (135 x 190cm)</li>\n<li>King - (5\'0" x 6\'6") / (150 x 200cm)</li>\n<li>Super King - (6\'0" x 6\'6") / (180 x 200cm)</li>\n</ul>\n<p><strong>Mattress Depth</strong></p>\n<ul>\n<li>10" / 25cm</li>\n</ul>\n<p><strong>Base Depth</strong></p>\n<ul>\n<li>15.5" / 39cm (Including Feet)</li>\n</ul>\n<p><strong>Drawer Dimensions </strong></p>\n<ul>\n<li>Height - 9" / 23cm</li>\n<li>Width - 29" / 74cm</li>\n<li>Depth - 20.5" / 52cm</li>\n<li>Internal Storage - 7" / 18cm</li>\n</ul>\n<p><strong>Storage Options</strong></p>\n<p><img src="https://admin.bedfactorydirect.co.uk/pub/media/storage-options-guide.jpg" alt="storage options guide" width="100%" /></p>\n<p style="font-size: 12px;">* All measurements are approximate and are subject to a tolerance of + or - 2cm</p>',
        shipping_grouptext: '3',
        option_group:
          'chenille_fabrics,faux_leather_fabrics,faux_suede_fabrics,crushed_velvet_fabrics,luxury_velvet_fabrics,premium_fabrics',
        name: 'Cavali Divan Bed',
        meta_title: 'Cavali Divan Bed',
        meta_description:
          'The Amazing Cavali divan bed has a deep hand tufted turnable mattress, full of luxury and support. Available in a rainbow of colours, this bed also has the option to add storage drawers if you need extra storage space.',
        image: '/c/a/cavali_grey.jpg',
        small_image: '/c/a/cavali_grey.jpg',
        thumbnail: '/c/a/cavali_grey.jpg',
        options_container: 'container2',
        image_label: 'cavali divan bed',
        small_image_label: 'cavali divan bed',
        thumbnail_label: 'cavali divan bed',
        country_of_manufacture: 'GB',
        msrp_display_actual_price_type: '0',
        url_key: 'cavali-divan-bed',
        slug: 'cavali-divan-bed',
        gift_message_available: '2',
        swatch_image: '/c/a/cavali_grey.jpg',
        manufacturing_parts: '28,29',
        cust_pro_canonical: '100',
        filter_size: '194,195,196,197,198',
        comfort_grade: '205',
        delivery_cms_block: 'standard_frame_delivery',
        mattress_type: '220',
        front_label_image_name: '0',
        price: '299.000000',
        special_price: '259.000000',
        weight: '10.000000',
        special_from_date: '2020-04-06 00:00:00',
        options: [{}, {}, {}],
        media_gallery: {
          images: {
            '201': {
              value_id: '201',
              file: '/c/a/cavali_grey.jpg',
              media_type: 'image',
              entity_id: '452',
              label: 'cavali divan bed',
              position: '2',
              disabled: '0',
              label_default: 'cavali divan bed',
              position_default: '2',
              disabled_default: '0',
              video_provider: null,
              video_url: null,
              video_title: null,
              video_description: null,
              video_metadata: null,
              video_provider_default: null,
              video_url_default: null,
              video_title_default: null,
              video_description_default: null,
              video_metadata_default: null
            },
            '3306': {
              value_id: '3306',
              file: '/2/-/2-drawers-side_20.jpg',
              media_type: 'image',
              entity_id: '452',
              label: 'cavali divan bed',
              position: '2',
              disabled: '0',
              label_default: 'cavali divan bed',
              position_default: '2',
              disabled_default: '0',
              video_provider: null,
              video_url: null,
              video_title: null,
              video_description: null,
              video_metadata: null,
              video_provider_default: null,
              video_url_default: null,
              video_title_default: null,
              video_description_default: null,
              video_metadata_default: null
            },
            '3307': {
              value_id: '3307',
              file: '/c/h/chrome-feet_20.jpg',
              media_type: 'image',
              entity_id: '452',
              label: 'cavali divan bed',
              position: '3',
              disabled: '0',
              label_default: 'cavali divan bed',
              position_default: '3',
              disabled_default: '0',
              video_provider: null,
              video_url: null,
              video_title: null,
              video_description: null,
              video_metadata: null,
              video_provider_default: null,
              video_url_default: null,
              video_title_default: null,
              video_description_default: null,
              video_metadata_default: null
            }
          },
          values: []
        },
        extension_attributes: {},
        tier_price: [],
        tier_price_changed: 0,
        category_ids: ['3', '13', '77', '51', '100', '119', '121', '124', '92'],
        is_salable: 1,
        product_option: {
          extension_attributes: {
            custom_options: {
              '6604': {
                option_id: 6604,
                option_value: 168776
              },
              '6605': {
                '6604': {
                  option_id: 6604,
                  option_value: 168776
                }
              }
            },
            configurable_item_options: [],
            bundle_options: []
          }
        }
      };
      let originalProduct = {
        average_score: 4,
        gift_message_available: true,
        front_label_image_name: '0',
        specs:
          '<p><strong>Divan Size</strong></p>\n<ul>\n<li>Single - (3\'0" x 6\'3") / (90 x 190cm)</li>\n<li>Small Double - (4\'0" x 6\'3") / (120 x 190cm)</li>\n<li>Double - (4\'6" x 6\'3") / (135 x 190cm)</li>\n<li>King - (5\'0" x 6\'6") / (150 x 200cm)</li>\n<li>Super King - (6\'0" x 6\'6") / (180 x 200cm)</li>\n</ul>\n<p><strong>Mattress Depth</strong></p>\n<ul>\n<li>10" / 25cm</li>\n</ul>\n<p><strong>Base Depth</strong></p>\n<ul>\n<li>15.5" / 39cm (Including Feet)</li>\n</ul>\n<p><strong>Drawer Dimensions </strong></p>\n<ul>\n<li>Height - 9" / 23cm</li>\n<li>Width - 29" / 74cm</li>\n<li>Depth - 20.5" / 52cm</li>\n<li>Internal Storage - 7" / 18cm</li>\n</ul>\n<p><strong>Storage Options</strong></p>\n<p><img src="https://admin.bedfactorydirect.co.uk/pub/media/storage-options-guide.jpg" alt="storage options guide" width="100%" /></p>\n<p style="font-size: 12px;">* All measurements are approximate and are subject to a tolerance of + or - 2cm</p>',
        product_label: 1,
        price: 259,
        special_from_date: '2020-04-06 00:00:00',
        id: 452,
        category_ids: [3, 13, 77, 51, 100, 119, 121, 124, 92],
        sku: 'cavali-divan-bed',
        filter_size: [194, 195, 196, 197, 198],
        stock: {
          is_in_stock: true,
          max_sale_qty: 10000,
          stock_status: 1,
          min_sale_qty: 1,
          item_id: 528,
          backorders: false,
          min_qty: 0,
          product_id: 452,
          qty: 10000000,
          is_qty_decimal: false,
          low_stock_date: null
        },
        brand: 34,
        slug: 'cavali-divan-bed',
        image: '/c/a/cavali_grey.jpg',
        thumbnail: '/c/a/cavali_grey.jpg',
        manufacturing_parts: [28, 29],
        swatches_sample_product: 0,
        visibility: 4,
        meta_title: 'Cavali Divan Bed',
        isFabrics: 0,
        weight: 10,
        isFabric: 1,
        product_type_1: 25,
        meta_description:
          'The Amazing Cavali divan bed has a deep hand tufted turnable mattress, full of luxury and support. Available in a rainbow of colours, this bed also has the option to add storage drawers if you need extra storage space.',
        country_of_manufacture: 'GB',
        comfort_grade: [205],
        meta_keyword: 'Sleepover Divan Bed',
        name: 'Cavali Divan Bed',
        shipping_grouptext: '3',
        status: 1,
        attributes_metadata: [
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Product Name',
            attribute_id: 73,
            id: 73,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'name'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'SKU',
            attribute_id: 74,
            id: 74,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: true,
            attribute_code: 'sku'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Description',
            attribute_id: 75,
            id: 75,
            entity_type_id: 4,
            frontend_input: 'textarea',
            is_user_defined: false,
            is_comparable: true,
            attribute_code: 'description'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Short Description',
            attribute_id: 76,
            id: 76,
            entity_type_id: 4,
            frontend_input: 'textarea',
            is_user_defined: false,
            is_comparable: true,
            attribute_code: 'short_description'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Price',
            attribute_id: 77,
            id: 77,
            entity_type_id: 4,
            frontend_input: 'price',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'price'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Special Price',
            attribute_id: 78,
            id: 78,
            entity_type_id: 4,
            frontend_input: 'price',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'special_price'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Special Price From Date',
            attribute_id: 79,
            id: 79,
            entity_type_id: 4,
            frontend_input: 'date',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'special_from_date'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Special Price To Date',
            attribute_id: 80,
            id: 80,
            entity_type_id: 4,
            frontend_input: 'date',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'special_to_date'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Cost',
            attribute_id: 81,
            id: 81,
            entity_type_id: 4,
            frontend_input: 'price',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'cost'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Weight',
            attribute_id: 82,
            id: 82,
            entity_type_id: 4,
            frontend_input: 'weight',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'weight'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Manufacturer',
            attribute_id: 83,
            id: 83,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: true,
            attribute_code: 'manufacturer'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Meta Title',
            attribute_id: 84,
            id: 84,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'meta_title'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Meta Keywords',
            attribute_id: 85,
            id: 85,
            entity_type_id: 4,
            frontend_input: 'textarea',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'meta_keyword'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Meta Description',
            attribute_id: 86,
            id: 86,
            entity_type_id: 4,
            frontend_input: 'textarea',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'meta_description'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Base',
            attribute_id: 87,
            id: 87,
            entity_type_id: 4,
            frontend_input: 'media_image',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'image'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Small',
            attribute_id: 88,
            id: 88,
            entity_type_id: 4,
            frontend_input: 'media_image',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'small_image'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Thumbnail',
            attribute_id: 89,
            id: 89,
            entity_type_id: 4,
            frontend_input: 'media_image',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'thumbnail'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Media Gallery',
            attribute_id: 90,
            id: 90,
            entity_type_id: 4,
            frontend_input: 'gallery',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'media_gallery'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Tier Price',
            attribute_id: 92,
            id: 92,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'tier_price'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Color',
            attribute_id: 93,
            id: 93,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: true,
            attribute_code: 'color'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Set Product as New from Date',
            attribute_id: 94,
            id: 94,
            entity_type_id: 4,
            frontend_input: 'date',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'news_from_date'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Set Product as New to Date',
            attribute_id: 95,
            id: 95,
            entity_type_id: 4,
            frontend_input: 'date',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'news_to_date'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Image Gallery',
            attribute_id: 96,
            id: 96,
            entity_type_id: 4,
            frontend_input: 'gallery',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'gallery'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Enable Product',
            attribute_id: 97,
            options: [
              {
                label: 'Enabled',
                value: '1'
              }
            ],
            id: 97,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'status'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Visibility',
            attribute_id: 99,
            options: [
              {
                label: 'Catalog, Search',
                value: '4'
              }
            ],
            id: 99,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'visibility'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'New Theme',
            attribute_id: 100,
            options: [
              {
                label: '-- Please Select --',
                value: ''
              }
            ],
            id: 100,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'custom_design'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Active From',
            attribute_id: 101,
            id: 101,
            entity_type_id: 4,
            frontend_input: 'date',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'custom_design_from'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Active To',
            attribute_id: 102,
            id: 102,
            entity_type_id: 4,
            frontend_input: 'date',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'custom_design_to'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Layout',
            attribute_id: 104,
            options: [
              {
                label: 'No layout updates',
                value: ''
              }
            ],
            id: 104,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'page_layout'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Categories',
            attribute_id: 105,
            id: 105,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'category_ids'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Display Product Options In',
            attribute_id: 106,
            id: 106,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'options_container'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Country of Manufacture',
            attribute_id: 114,
            options: [
              {
                label: 'United Kingdom',
                value: 'GB'
              }
            ],
            id: 114,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'country_of_manufacture'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Quantity',
            attribute_id: 115,
            id: 115,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'quantity_and_stock_status'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'New Layout',
            attribute_id: 116,
            options: [
              {
                label: 'No layout updates',
                value: ''
              }
            ],
            id: 116,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'custom_layout'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Minimum Advertised Price',
            attribute_id: 117,
            id: 117,
            entity_type_id: 4,
            frontend_input: 'price',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'msrp'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Display Actual Price',
            attribute_id: 118,
            options: [
              {
                label: 'Use config',
                value: '0'
              }
            ],
            id: 118,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'msrp_display_actual_price_type'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'URL Key',
            attribute_id: 121,
            id: 121,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'url_key'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Dynamic Price',
            attribute_id: 127,
            id: 127,
            entity_type_id: 4,
            frontend_input: 'boolean',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'price_type'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Dynamic SKU',
            attribute_id: 128,
            id: 128,
            entity_type_id: 4,
            frontend_input: 'boolean',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'sku_type'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Dynamic Weight',
            attribute_id: 129,
            id: 129,
            entity_type_id: 4,
            frontend_input: 'boolean',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'weight_type'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Price View',
            attribute_id: 130,
            id: 130,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'price_view'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Ship Bundle Items',
            attribute_id: 131,
            id: 131,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'shipment_type'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Allow Gift Message',
            attribute_id: 132,
            options: [
              {
                label: 'Yes',
                value: '1'
              }
            ],
            id: 132,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'gift_message_available'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Swatch',
            attribute_id: 133,
            id: 133,
            entity_type_id: 4,
            frontend_input: 'media_image',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'swatch_image'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Tax Class',
            attribute_id: 134,
            options: [
              {
                label: 'Taxable Goods',
                value: '2'
              }
            ],
            id: 134,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'tax_class_id'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'product type',
            attribute_id: 145,
            options: [
              {
                label: 'bfd',
                value: '25',
                sort_order: 1
              }
            ],
            id: 145,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'product_type_1'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'manufacturing parts',
            attribute_id: 146,
            options: [
              {
                label: 'base',
                value: '28',
                sort_order: 2
              },
              {
                label: 'mattress',
                value: '29',
                sort_order: 3
              }
            ],
            id: 146,
            entity_type_id: 4,
            frontend_input: 'multiselect',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'manufacturing_parts'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Brand',
            attribute_id: 149,
            options: [
              {
                label: 'Bed Factory',
                value: '34',
                sort_order: 1
              }
            ],
            id: 149,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'brand'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Size',
            attribute_id: 152,
            id: 152,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'size'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Colour',
            attribute_id: 153,
            id: 153,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'colour'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Custom Product Canonical URL',
            attribute_id: 159,
            id: 159,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'cust_pro_canonical'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'specs',
            attribute_id: 165,
            id: 165,
            entity_type_id: 4,
            frontend_input: 'textarea',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'specs'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Storage Drawers',
            attribute_id: 166,
            id: 166,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'storage_drawers'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Shipping Group',
            attribute_id: 167,
            options: [
              {
                label: '2 Man Delivery',
                value: '1'
              }
            ],
            id: 167,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'shipping_group'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Shipping Group lead days',
            attribute_id: 168,
            id: 168,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'shipping_grouptext'
          },
          {
            is_visible_on_front: true,
            is_visible: true,
            default_frontend_label: 'Is Fabric',
            attribute_id: 169,
            options: [
              {
                label: 'Yes',
                value: '1'
              }
            ],
            id: 169,
            entity_type_id: 4,
            frontend_input: 'boolean',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'isFabric'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Sample Atrribute',
            attribute_id: 170,
            id: 170,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'sample_attribute'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Fabric Type',
            attribute_id: 171,
            options: [
              {
                label: 'Chenille',
                value: '0'
              }
            ],
            id: 171,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'isFabrics'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Filter Size',
            attribute_id: 173,
            options: [
              {
                label: 'Single',
                value: '194',
                sort_order: 1
              },
              {
                label: 'Small Double',
                value: '195',
                sort_order: 2
              },
              {
                label: 'Double',
                value: '196',
                sort_order: 3
              },
              {
                label: 'King',
                value: '197',
                sort_order: 4
              },
              {
                label: 'Super King',
                value: '198',
                sort_order: 5
              }
            ],
            id: 173,
            entity_type_id: 4,
            frontend_input: 'multiselect',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'filter_size'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Comfort Grade',
            attribute_id: 174,
            options: [
              {
                label: '3-Medium',
                value: '205',
                sort_order: 3
              }
            ],
            id: 174,
            entity_type_id: 4,
            frontend_input: 'multiselect',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'comfort_grade'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Swatches Sample Product',
            attribute_id: 177,
            options: [
              {
                label: 'No',
                value: '0'
              }
            ],
            id: 177,
            entity_type_id: 4,
            frontend_input: 'boolean',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'swatches_sample_product'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Option Group',
            attribute_id: 179,
            options: [
              {
                label: 'Chenille Fabrics',
                value: 'chenille_fabrics'
              },
              {
                label: 'Faux Leather Fabrics',
                value: 'faux_leather_fabrics'
              },
              {
                label: 'Faux Suede Fabrics',
                value: 'faux_suede_fabrics'
              },
              {
                label: 'Crushed Velvet Fabrics',
                value: 'crushed_velvet_fabrics'
              },
              {
                label: 'Luxury Velvet Fabrics',
                value: 'luxury_velvet_fabrics'
              },
              {
                label: 'Premium Fabrics',
                value: 'premium_fabrics'
              }
            ],
            id: 179,
            entity_type_id: 4,
            frontend_input: 'multiselect',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'option_group'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Delivery Tab CMS Block',
            attribute_id: 180,
            options: [
              {
                label: 'Delivery - Standard Bed Frame',
                value: 'standard_frame_delivery'
              }
            ],
            id: 180,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'delivery_cms_block'
          },
          {
            is_visible_on_front: true,
            is_visible: true,
            default_frontend_label: 'Mattress Type',
            attribute_id: 182,
            options: [
              {
                label: 'Open Coil',
                value: '220',
                sort_order: 2
              }
            ],
            id: 182,
            entity_type_id: 4,
            frontend_input: 'multiselect',
            is_user_defined: true,
            is_comparable: true,
            attribute_code: 'mattress_type'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Configuration',
            attribute_id: 185,
            id: 185,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: true,
            attribute_code: 'product_configuration'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Furniture Range',
            attribute_id: 186,
            id: 186,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'furniture_range'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Ottoman Lift',
            attribute_id: 187,
            id: 187,
            entity_type_id: 4,
            frontend_input: 'multiselect',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'ottoman_lift'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Custom Layout Update',
            attribute_id: 188,
            id: 188,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'custom_layout_update_file'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Imegamedia Finance Filter',
            attribute_id: 200,
            id: 200,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'imegamedia_finance_filter'
          },
          {
            is_visible_on_front: true,
            is_visible: true,
            default_frontend_label: 'Total Reviews',
            attribute_id: 201,
            id: 201,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'total_reviews'
          },
          {
            is_visible_on_front: true,
            is_visible: true,
            default_frontend_label: 'Average Score',
            attribute_id: 202,
            id: 202,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'average_score'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Stock Check',
            attribute_id: 203,
            options: [
              {
                label: 'No',
                value: '0'
              }
            ],
            id: 203,
            entity_type_id: 4,
            frontend_input: 'boolean',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'isStock'
          },
          {
            is_visible_on_front: true,
            is_visible: true,
            default_frontend_label: 'Guarantee',
            attribute_id: 204,
            id: 204,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: true,
            attribute_code: 'guarantee'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Product Label',
            attribute_id: 205,
            options: [
              {
                label: 'Yes',
                value: '1'
              }
            ],
            id: 205,
            entity_type_id: 4,
            frontend_input: 'boolean',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'product_label'
          },
          {
            is_visible_on_front: true,
            is_visible: true,
            default_frontend_label: 'Front Label Type',
            attribute_id: 207,
            options: [
              {
                label: 'Please Select Option',
                value: '0'
              }
            ],
            id: 207,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'front_label_image_name'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Fragrance',
            attribute_id: 208,
            id: 208,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'fragrance'
          }
        ],
        short_description:
          '<ul>\n<li>Medium Firmness</li>\n<li>Hand Tufted</li>\n<li>Turnable</li>\n<li>Choice Of Colours</li>\n<li>Storage Options</li>\n</ul>',
        description:
          '<p>The Cavali divan bed is a smart, modern divan with both a comfortable mattress and an attractive looking base. The mattress of this bed is a traditional sprung mattress finished in a quilted damask fabric. The mattress is hand tufted, making the fillings densely packed and adding extra durability to your mattress.</p>\n<p>The base of the Cavali divan is available in a choice of modern chenille fabrics, giving you great flexibility if you need the bed to fit into a particular colour scheme. You can also add storage options to the base if you could benefit from the extra space in keeping your bedroom neat and tidy.</p>\n<p>The bed photographed is upholstered in Wool Steel fabric with our <span style="text-decoration: underline;"><a href="https://bedfactorydirect.co.uk/coniston-22-chenille-headboard">Coniston headboard</a></span>. Don\'t forget to add the headboard to your basket to complete the look of your new Divan.</p>',
        tsk: 1642142751,
        option_group: [
          'chenille_fabrics',
          'faux_leather_fabrics',
          'faux_suede_fabrics',
          'crushed_velvet_fabrics',
          'luxury_velvet_fabrics',
          'premium_fabrics'
        ],
        regular_price: 299,
        final_price: 259,
        product_links: [
          {
            link_type: 'crosssell',
            linked_product_sku: 'MP2MattressProtector',
            linked_product_type: 'configurable',
            position: 1,
            sku: 'cavali-divan-bed'
          },
          {
            link_type: 'crosssell',
            linked_product_sku: 'Luxury Hotel Duvet Cover And Pillowcases',
            linked_product_type: 'simple',
            position: 2,
            sku: 'cavali-divan-bed'
          },
          {
            link_type: 'crosssell',
            linked_product_sku: 'Bed Factory Essential Pillows',
            linked_product_type: 'simple',
            position: 3,
            sku: 'cavali-divan-bed'
          },
          {
            link_type: 'crosssell',
            linked_product_sku: 'Tranquil Pillow',
            linked_product_type: 'simple',
            position: 4,
            sku: 'cavali-divan-bed'
          },
          {
            link_type: 'crosssell',
            linked_product_sku: 'Divan Bed Removal',
            linked_product_type: 'simple',
            position: 5,
            sku: 'cavali-divan-bed'
          },
          {
            link_type: 'crosssell',
            linked_product_sku: 'Divan Bed Assembly',
            linked_product_type: 'simple',
            position: 6,
            sku: 'cavali-divan-bed'
          }
        ],
        url_path: 'cavali-divan-bed',
        type_id: 'configurable',
        media_gallery: [
          {
            image: '/2/-/2-drawers-side_20.jpg',
            pos: 2,
            typ: 'image',
            lab: 'cavali divan bed'
          },
          {
            image: '/c/a/cavali_grey.jpg',
            pos: 2,
            typ: 'image',
            lab: 'cavali divan bed'
          },
          {
            image: '/c/h/chrome-feet_20.jpg',
            pos: 3,
            typ: 'image',
            lab: 'cavali divan bed'
          }
        ],
        tax_class_id: 2,
        delivery_cms_block: 'standard_frame_delivery',
        url_key: 'cavali-divan-bed',
        cust_pro_canonical: '100',
        shipping_group: 1,
        special_price: 259,
        custom_options: [
          {
            image_size_x: '0',
            image_size_y: '0',
            max_characters: '0',
            price: 0,
            values: [
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 0,
                option_type_id: '17409',
                logo: '',
                price_type: 'fixed',
                sku: '3ft',
                title: 'Single',
                sort_order: 0,
                layer: null
              },
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 120,
                option_type_id: '17410',
                logo: '',
                price_type: 'fixed',
                sku: '4ft',
                title: 'Small Double',
                sort_order: 1,
                layer: null
              },
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 120,
                option_type_id: '17411',
                logo: '',
                price_type: 'fixed',
                sku: '4ft6',
                title: 'Double',
                sort_order: 2,
                layer: null
              },
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 170,
                option_type_id: '17412',
                logo: '',
                price_type: 'fixed',
                sku: '5ft',
                title: 'King',
                sort_order: 3,
                layer: null
              },
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 240,
                option_type_id: '17413',
                logo: '',
                price_type: 'fixed',
                sku: '6ft',
                title: 'Super King',
                sort_order: 4,
                layer: null
              }
            ],
            price_type: null,
            option_id: 13,
            iscolor: '0',
            is_require: true,
            type: 'select',
            title: 'Size',
            sort_order: 1
          },
          {
            image_size_x: '0',
            image_size_y: '0',
            max_characters: '0',
            price: 0,
            values: [
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 0,
                option_type_id: '17414',
                logo: '',
                price_type: 'fixed',
                sku: 'standard',
                title: 'No Storage',
                sort_order: 0,
                layer: null
              },
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 60,
                option_type_id: '17415',
                logo: '',
                price_type: 'fixed',
                sku: '2drs',
                title: '2 Drawers Side',
                sort_order: 1,
                layer: null
              },
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 60,
                option_type_id: '17416',
                logo: '',
                price_type: 'fixed',
                sku: '2dre',
                title: '2 Drawers End',
                sort_order: 2,
                layer: null
              },
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 100,
                option_type_id: '17417',
                logo: '',
                price_type: 'fixed',
                sku: '4dr',
                title: '4 Drawers',
                sort_order: 3,
                layer: null
              }
            ],
            price_type: null,
            option_id: 14,
            iscolor: '',
            is_require: true,
            type: 'select',
            title: 'Storage',
            sort_order: 2
          },
          {
            image_size_x: '0',
            image_size_y: '0',
            max_characters: '0',
            price: 0,
            values: [
              {
                image: '',
                colour: 'Purple',
                quantity: '',
                price: 10,
                option_type_id: '168776',
                logo: '',
                price_type: 'fixed',
                sku: 'aubchen',
                title: 'Aubergine Chenille',
                sort_order: 1,
                layer: '/../../productreview/tmp/image/aubergine-chenille.jpg'
              },
              {
                image: '',
                colour: 'Black ',
                quantity: '',
                price: 0,
                option_type_id: '168777',
                logo: '',
                price_type: 'fixed',
                sku: 'blkchen',
                title: 'Black Chenille',
                sort_order: 2,
                layer: '/../../productreview/tmp/image/black-chenille.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168778',
                logo: '',
                price_type: 'fixed',
                sku: 'brnchen',
                title: 'Brown Chenille',
                sort_order: 3,
                layer: '/../../productreview/tmp/image/brown-chenille.jpg'
              },
              {
                image: '',
                colour: 'Charcoal',
                quantity: '',
                price: 0,
                option_type_id: '168779',
                logo: '',
                price_type: 'fixed',
                sku: 'charchen',
                title: 'Charcoal Chenille',
                sort_order: 4,
                layer: '/../../productreview/tmp/image/charocal-chenille.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168780',
                logo: '',
                price_type: 'fixed',
                sku: 'grychen',
                title: 'Grey Chenille',
                sort_order: 5,
                layer: '/../../productreview/tmp/image/grey-chenille.jpg'
              },
              {
                image: '',
                colour: 'Cream',
                quantity: '',
                price: 0,
                option_type_id: '168781',
                logo: '',
                price_type: 'fixed',
                sku: 'natchen',
                title: 'Natural Chenille',
                sort_order: 6,
                layer: '/../../productreview/tmp/image/natural-chenille.jpg'
              },
              {
                image: '',
                colour: 'Purple',
                quantity: '',
                price: 0,
                option_type_id: '168782',
                logo: '',
                price_type: 'fixed',
                sku: 'purchen',
                title: 'Purple Chenille',
                sort_order: 7,
                layer: '/../../productreview/tmp/image/purple-chenille.jpg'
              },
              {
                image: '',
                colour: 'Sand',
                quantity: '',
                price: 0,
                option_type_id: '168783',
                logo: '',
                price_type: 'fixed',
                sku: 'sanchen',
                title: 'Sand Chenille',
                sort_order: 8,
                layer: '/../../productreview/tmp/image/sand-chenille.jpg'
              },
              {
                image: '',
                colour: 'Cream',
                quantity: '',
                price: 0,
                option_type_id: '168784',
                logo: '',
                price_type: 'fixed',
                sku: 'stochen',
                title: 'Stone Chenille',
                sort_order: 9,
                layer: '/../../productreview/tmp/image/stone-chenille.jpg'
              },
              {
                image: '',
                colour: 'Teal',
                quantity: '',
                price: 0,
                option_type_id: '168785',
                logo: '',
                price_type: 'fixed',
                sku: 'techen',
                title: 'Teal Chenille',
                sort_order: 10,
                layer: '/../../productreview/tmp/image/teal-chenille.jpg'
              },
              {
                image: '',
                colour: 'Black',
                quantity: '',
                price: 0,
                option_type_id: '168786',
                logo: '',
                price_type: 'fixed',
                sku: 'blkfaux',
                title: 'Black Faux Leather',
                sort_order: 11,
                layer: '/../../productreview/tmp/image/black-faux-leather.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168787',
                logo: '',
                price_type: 'fixed',
                sku: 'brnfaux',
                title: 'Brown Faux Leather',
                sort_order: 12,
                layer: '/../../productreview/tmp/image/brown-faux-leather.jpg'
              },
              {
                image: '',
                colour: 'Cream',
                quantity: '',
                price: 0,
                option_type_id: '168788',
                logo: '',
                price_type: 'fixed',
                sku: 'crmfaux',
                title: 'Cream Faux Leather',
                sort_order: 13,
                layer: '/../../productreview/tmp/image/cream-faux-leather.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168789',
                logo: '',
                price_type: 'fixed',
                sku: 'gryfaux',
                title: 'Grey Faux Leather',
                sort_order: 14,
                layer: '/../../productreview/tmp/image/grey-faux-leather.jpg'
              },
              {
                image: '',
                colour: 'White',
                quantity: '',
                price: 0,
                option_type_id: '168790',
                logo: '',
                price_type: 'fixed',
                sku: 'whtfaux',
                title: 'White Faux Leather',
                sort_order: 15,
                layer: '/../../productreview/tmp/image/white-faux-leather.jpg'
              },
              {
                image: '',
                colour: 'Black',
                quantity: '',
                price: 0,
                option_type_id: '168791',
                logo: '',
                price_type: 'fixed',
                sku: 'blkfauxs',
                title: 'Black Faux Suede',
                sort_order: 16,
                layer: '/../../productreview/tmp/image/black-suede.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168792',
                logo: '',
                price_type: 'fixed',
                sku: 'brnfauxs',
                title: 'Brown Faux Suede',
                sort_order: 17,
                layer: '/../../productreview/tmp/image/brown-suede.jpg'
              },
              {
                image: '',
                colour: 'Cream',
                quantity: '',
                price: 0,
                option_type_id: '168793',
                logo: '',
                price_type: 'fixed',
                sku: 'crmfaux',
                title: 'Cream Faux Suede',
                sort_order: 18,
                layer: '/../../productreview/tmp/image/cream-suede.jpg'
              },
              {
                image: '',
                colour: 'Ivory',
                quantity: '',
                price: 0,
                option_type_id: '168794',
                logo: '',
                price_type: 'fixed',
                sku: 'cshvi',
                title: 'Crushed Velvet Ivory',
                sort_order: 19,
                layer: '/../../productreview/tmp/image/crushed-velvet-ivory.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168795',
                logo: '',
                price_type: 'fixed',
                sku: 'cshvs',
                title: 'Crushed Velvet Steel',
                sort_order: 20,
                layer: '/../../productreview/tmp/image/crushed-velvet-steel.jpg'
              },
              {
                image: '',
                colour: 'Black',
                quantity: '',
                price: 0,
                option_type_id: '168796',
                logo: '',
                price_type: 'fixed',
                sku: 'blkluxv',
                title: 'Black Luxury Velvet',
                sort_order: 21,
                layer: '/../../productreview/tmp/image/luxury-velvet-ebony.jpg'
              },
              {
                image: '',
                colour: 'Blue',
                quantity: '',
                price: 0,
                option_type_id: '168797',
                logo: '',
                price_type: 'fixed',
                sku: 'mluxv',
                title: 'Marine Luxury Velvet',
                sort_order: 22,
                layer: '/../../productreview/tmp/image/luxury-velvet-marine.jpg'
              },
              {
                image: '',
                colour: 'Mink',
                quantity: '',
                price: 0,
                option_type_id: '168798',
                logo: '',
                price_type: 'fixed',
                sku: 'minluxv',
                title: 'Mink Luxury Velvet',
                sort_order: 23,
                layer: '/../../productreview/tmp/image/luxury-velvet-mink.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168799',
                logo: '',
                price_type: 'fixed',
                sku: 'pluxv',
                title: 'Pebble Luxury Velvet',
                sort_order: 24,
                layer: '/../../productreview/tmp/image/luxury-velvet-pebble.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168800',
                logo: '',
                price_type: 'fixed',
                sku: 'stluxv',
                title: 'Steel Luxury Velvet',
                sort_order: 25,
                layer: '/../../productreview/tmp/image/luxury-velvet-steel.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168801',
                logo: '',
                price_type: 'fixed',
                sku: 'arrantruf',
                title: 'Arrran Truffle',
                sort_order: 26,
                layer: '/../../productreview/tmp/image/Arran-truffle.jpg'
              },
              {
                image: '',
                colour: 'Blue',
                quantity: '',
                price: 0,
                option_type_id: '168802',
                logo: '',
                price_type: 'fixed',
                sku: 'atalntic',
                title: 'Atlantic',
                sort_order: 27,
                layer: '/../../productreview/tmp/image/atlantic.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168803',
                logo: '',
                price_type: 'fixed',
                sku: 'bertruf',
                title: 'Berwick Truffle',
                sort_order: 28,
                layer: '/../../productreview/tmp/image/berwick-truffle.jpg'
              },
              {
                image: '',
                colour: 'Cream',
                quantity: '',
                price: 0,
                option_type_id: '168804',
                logo: '',
                price_type: 'fixed',
                sku: 'brackbe',
                title: 'Bracken Beige',
                sort_order: 29,
                layer: '/../../productreview/tmp/image/bracken-beige.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168805',
                logo: '',
                price_type: 'fixed',
                sku: 'brackchar',
                title: 'Bracken Charcoal',
                sort_order: 30,
                layer: '/../../productreview/tmp/image/bracken-charcoal.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168806',
                logo: '',
                price_type: 'fixed',
                sku: 'conc',
                title: 'Concrete ',
                sort_order: 31,
                layer: '/../../productreview/tmp/image/concrete.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168807',
                logo: '',
                price_type: 'fixed',
                sku: 'countb',
                title: 'Country Beige',
                sort_order: 32,
                layer: '/../../productreview/tmp/image/country-beige.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168808',
                logo: '',
                price_type: 'fixed',
                sku: 'gracegra',
                title: 'Graceland Graphite',
                sort_order: 34,
                layer: '/../../productreview/tmp/image/graceland-graphite.jpg'
              },
              {
                image: '',
                colour: 'Pink',
                quantity: '',
                price: 0,
                option_type_id: '168809',
                logo: '',
                price_type: 'fixed',
                sku: 'gracepnk',
                title: 'Graceland Pink',
                sort_order: 35,
                layer: '/../../productreview/tmp/image/graceland-ping.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168810',
                logo: '',
                price_type: 'fixed',
                sku: 'gracesil',
                title: 'Graceland SIlver',
                sort_order: 36,
                layer: '/../../productreview/tmp/image/graceland-silver_1.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168811',
                logo: '',
                price_type: 'fixed',
                sku: 'hessian',
                title: 'Hessian Fabric',
                sort_order: 38,
                layer: '/../../productreview/tmp/image/hessian.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168812',
                logo: '',
                price_type: 'fixed',
                sku: 'jeffc',
                title: 'Jeff Clay',
                sort_order: 39,
                layer: '/../../productreview/tmp/image/jeff-clay.jpg'
              },
              {
                image: '',
                colour: 'Gey',
                quantity: '',
                price: 0,
                option_type_id: '168813',
                logo: '',
                price_type: 'fixed',
                sku: 'linslt',
                title: 'Linette Slate',
                sort_order: 40,
                layer: '/../../productreview/tmp/image/linetta-slate.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168814',
                logo: '',
                price_type: 'fixed',
                sku: 'quarry',
                title: 'Quarry',
                sort_order: 41,
                layer: '/../../productreview/tmp/image/quarry.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168815',
                logo: '',
                price_type: 'fixed',
                sku: 'wooll',
                title: 'Wool Latte',
                sort_order: 42,
                layer: '/../../productreview/tmp/image/wool-latte.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168816',
                logo: '',
                price_type: 'fixed',
                sku: 'wools',
                title: 'Wool Steel',
                sort_order: 43,
                layer: '/../../productreview/tmp/image/wool-steel.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168817',
                logo: '',
                price_type: 'fixed',
                sku: 'mercury',
                title: 'Mercury',
                sort_order: 44,
                layer: '/../../productreview/tmp/image/mercury.jpg'
              }
            ],
            price_type: null,
            option_id: 6604,
            iscolor: '1',
            is_require: true,
            type: 'select',
            title: 'Fabrics',
            sort_order: 10
          }
        ],
        total_reviews: 48,
        category: [
          {
            category_id: 3,
            name: 'Beds',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 13,
            name: 'Divan Beds',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 77,
            name: 'Open Coil Divans',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 51,
            name: 'Bed Factory Direct',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 100,
            name: 'Divan Beds Sale',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 119,
            name: 'Black Friday Divan Beds',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 121,
            name: 'Black Friday Deals',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 124,
            name: 'Cyber Week Divan Beds',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 92,
            name: 'Snooze Zone',
            is_blacklisted: 0,
            position: 1
          }
        ],
        isStock: 0,
        mattress_type: [220],
        original_price: 299,
        original_price_tax: 0,
        original_price_incl_tax: 299,
        originalPrice: 299,
        originalPriceTax: 0,
        originalPriceInclTax: 299,
        original_special_price: 259,
        original_final_price: 259,
        price_tax: 0,
        price_incl_tax: 259,
        priceTax: 0,
        priceInclTax: 259,
        special_price_tax: 0,
        special_price_incl_tax: 0,
        specialPrice: 259,
        specialPriceTax: 0,
        specialPriceInclTax: 0,
        final_price_tax: 0,
        final_price_incl_tax: 259,
        finalPrice: 259,
        finalPriceTax: 0,
        finalPriceInclTax: 259,
        _score: 0,
        qty: 1,
        errors: {
          custom_options: null,
          custom_options_customOption_13: null,
          custom_options_customOption_14: null,
          custom_options_customOption_6604: null
        },
        info: {},
        parentSku: 'cavali-divan-bed',
        parentId: 452,
        product_option: {
          extension_attributes: {
            custom_options: {
              '13': {
                option_id: 13,
                option_value: '17411'
              },
              '14': {
                option_id: 14,
                option_value: '17416'
              },
              '6604': {
                option_id: 6604,
                option_value: '168790'
              }
            },
            configurable_item_options: [],
            bundle_options: []
          }
        }
      };
      let configurable = {
  "short_description": "<ul>\n<li>Wooden Bed</li>\n<li>Quick Delivery</li>\n<li>Flat Slats</li>\n<li>Central Support Leg</li>\n</ul>",
  "average_score": 4,
  "gift_message_available": false,
  "description": "<p>The Sedna bed frame by Limelight is a classic looking wooden bed with a modern finish. The simple design of the Sedna means it will fit into any style bedroom and will give a clean and fresh feel to your bedroom through it's natural wood design.</p>\n<p>The Sedna is available in all UK standard sizes with a next day delivery option if required.</p>",
  "configurable_options": [
    {
      "attribute_id": 152,
      "values": [
        {
          "value_index": "47",
          "label": "Single"
        },
        {
          "value_index": "48",
          "label": "Small Double"
        },
        {
          "value_index": "49",
          "label": "Double"
        },
        {
          "value_index": "52",
          "label": "King Size"
        }
      ],
      "label": "Size",
      "attribute_code": "size"
    }
  ],
  "tsk": 1642597743,
  "size_options": [
    47,
    48,
    49,
    52
  ],
  "specs": "<p><strong>Dimensions Single:</strong></p>\r\n<ul>\r\n<li>Length: 202cm</li>\r\n<li>Width: 98cm</li>\r\n<li>Headboard Height: 90cm</li>\r\n<li>Footboard Height: 65cm</li>\r\n<li>Underbed Clearance: 26cm</li>\r\n</ul>\r\n<p><strong>Dimensions Small Double:</strong></p>\r\n<ul>\r\n<li>Length: 202cm</li>\r\n<li>Width: 130cm</li>\r\n<li>Headboard Height: 90cm</li>\r\n<li>Footboard Height: 65cm</li>\r\n<li>Underbed Clearance: 26cm</li>\r\n</ul>\r\n<p><strong>Dimensions Double:</strong></p>\r\n<ul>\r\n<li>Length: 202cm</li>\r\n<li>Width: 133cm</li>\r\n<li>Headboard Height: 90cm</li>\r\n<li>Footboard Height: 65cm</li>\r\n<li>Underbed Clearance: 26cm</li>\r\n</ul>\r\n<p><strong>Dimensions King:</strong></p>\r\n<ul>\r\n<li>Length: 202cm</li>\r\n<li>Width: 159cm</li>\r\n<li>Headboard Height: 90cm</li>\r\n<li>Footboard Height: 65cm</li>\r\n<li>Underbed Clearance: 26cm</li>\r\n</ul>",
  "regular_price": 379,
  "product_label": 1,
  "final_price": 229,
  "price": 229,
  "id": 879,
  "category_ids": [
    3,
    16,
    57
  ],
  "sku": "S02",
  "filter_size": [
    194,
    195,
    196,
    198
  ],
  "stock": {
    "is_in_stock": true,
    "stock_status": 1,
    "min_qty": 0,
    "qty": 92,
    "use_config_notify_stock_qty": true,
    "notify_stock_qty": 1
  },
  "brand": 38,
  "slug": "limelight-sedna-bedstead",
  "url_path": "limelight-sedna-bedstead",
  "image": "/s/e/sedna_wide162.jpg",
  "thumbnail": "/s/e/sedna_wide162.jpg",
  "manufacturing_parts": [
    27
  ],
  "swatches_sample_product": 0,
  "visibility": 4,
  "meta_title": "Limelight Sedna Bedstead",
  "type_id": "configurable",
  "media_gallery": [
    {
      "image": "/s/e/sedna_wide162.jpg",
      "pos": 1,
      "typ": "image",
      "lab": "Sedna Wooden Bed"
    },
    {
      "image": "/l/i/limelight-sedna-wooden_front.jpg",
      "pos": 2,
      "typ": "image",
      "lab": "LimeLight-Sedna-Wooden Front"
    },
    {
      "image": "/l/i/limelight-sedna-wooden_headend.jpg",
      "pos": 3,
      "typ": "image",
      "lab": "LimeLight-Sedna-Wooden Headend"
    },
    {
      "image": "/l/i/limelight-sedna-wooden_footend.jpg",
      "pos": 4,
      "typ": "image",
      "lab": "LimeLight-Sedna-Wooden Footend"
    }
  ],
  "tax_class_id": 2,
  "weight": 10,
  "delivery_cms_block": "limelight_delivery",
  "isFabric": 0,
  "url_key": "limelight-sedna-bedstead",
  "cust_pro_canonical": "100",
  "product_type_1": 26,
  "meta_description": "The Limelight Sedna Bedstead made from solid wood is a simple slatted frame to suit any bedroom. Supplied through Bed Factory direct with free delivery. ",
  "country_of_manufacture": "GB",
  "shipping_group": 1,
  "special_price": 229,
  "meta_keyword": "Limelight; Sedna; Wooden; Bed Frame; Bed Factory Direct",
  "name": "Limelight Sedna Wooden Bed",
  "total_reviews": 5,
  "configurable_children": [
    {
      "short_description": "<ul>\r\n<li>Wooden Bed</li>\r\n<li>Quick Delivery</li>\r\n<li>Flat Slats</li>\r\n<li>Central Support Leg</li>\r\n</ul>",
      "gift_message_available": false,
      "description": "<p>The Sedna bed frame by Limelight is a classic looking wooden bed with a modern finish. The simple design of the Sedna means it will fit into any style bedroom and will give a clean and fresh feel to your bedroom through it's natural wood design.</p>\r\n<p>The Sedna is available in all UK standard sizes to fit your new or existing mattress.</p>",
      "regular_price": 329,
      "final_price": 179,
      "price": 179,
      "special_from_date": "2020-06-03 00:00:00",
      "id": 877,
      "sku": "S01",
      "filter_size": [
        194,
        195,
        196,
        198
      ],
      "stock": {
        "is_in_stock": true,
        "stock_status": 1,
        "min_qty": 0,
        "qty": 68,
        "use_config_notify_stock_qty": true,
        "notify_stock_qty": 1
      },
      "brand": 38,
      "manufacturing_parts": [
        27
      ],
      "swatches_sample_product": 0,
      "visibility": 1,
      "meta_title": "Limelight Sedna Bedstead",
      "tax_class_id": 2,
      "weight": 10,
      "delivery_cms_block": "limelight_delivery",
      "isFabric": 0,
      "cust_pro_canonical": "100",
      "product_type_1": 26,
      "meta_description": "The Limelight Sedna Bedstead made from solid wood is a simple slatted frame to suit any bedroom. Supplied through Bed Factory direct with free delivery. ",
      "country_of_manufacture": "GB",
      "size": 47,
      "shipping_group": 1,
      "special_price": 179,
      "meta_keyword": "Limelight; Sedna; Wooden; Bed Frame; Bed Factory Direct",
      "name": "Limelight Sedna Wooden Bed-Single",
      "shipping_grouptext": "5",
      "status": 1,
      "original_price": 329,
      "original_price_tax": 0,
      "original_price_incl_tax": 329,
      "originalPrice": 329,
      "originalPriceTax": 0,
      "originalPriceInclTax": 329,
      "original_special_price": 179,
      "original_final_price": 179,
      "price_tax": 0,
      "price_incl_tax": 179,
      "priceTax": 0,
      "priceInclTax": 179,
      "special_price_tax": 0,
      "special_price_incl_tax": 0,
      "specialPrice": 179,
      "specialPriceTax": 0,
      "specialPriceInclTax": 0,
      "final_price_tax": 0,
      "final_price_incl_tax": 179,
      "finalPrice": 179,
      "finalPriceTax": 0,
      "finalPriceInclTax": 179
    },
    {
      "short_description": "<ul>\n<li>Wooden Bed</li>\n<li>Quick Delivery</li>\n<li>Flat Slats</li>\n<li>Central Support Leg</li>\n</ul>",
      "gift_message_available": false,
      "description": "<p>The Sedna bed frame by Limelight is a classic looking wooden bed with a modern finish. The simple design of the Sedna means it will fit into any style bedroom and will give a clean and fresh feel to your bedroom through it's natural wood design.</p>\n<p>The Sedna is available in all UK standard sizes with a next day delivery option if required.</p>",
      "regular_price": 379,
      "final_price": 229,
      "price": 229,
      "special_from_date": "2020-06-03 00:00:00",
      "id": 878,
      "sku": "S05",
      "filter_size": [
        194,
        195,
        196,
        198
      ],
      "stock": {
        "is_in_stock": true,
        "stock_status": 1,
        "min_qty": 0,
        "qty": 136,
        "use_config_notify_stock_qty": true,
        "notify_stock_qty": 1
      },
      "brand": 38,
      "manufacturing_parts": [
        27
      ],
      "swatches_sample_product": 0,
      "visibility": 1,
      "meta_title": "Limelight Sedna Bedstead",
      "tax_class_id": 2,
      "weight": 10,
      "delivery_cms_block": "limelight_delivery",
      "isFabric": 0,
      "cust_pro_canonical": "100",
      "product_type_1": 26,
      "meta_description": "The Limelight Sedna Bedstead made from solid wood is a simple slatted frame to suit any bedroom. Supplied through Bed Factory direct with free delivery. ",
      "country_of_manufacture": "GB",
      "size": 48,
      "shipping_group": 1,
      "special_price": 229,
      "meta_keyword": "Limelight; Sedna; Wooden; Bed Frame; Bed Factory Direct",
      "name": "Limelight Sedna Wooden Bed-Small Double",
      "shipping_grouptext": "5",
      "status": 1,
      "original_price": 379,
      "original_price_tax": 0,
      "original_price_incl_tax": 379,
      "originalPrice": 379,
      "originalPriceTax": 0,
      "originalPriceInclTax": 379,
      "original_special_price": 229,
      "original_final_price": 229,
      "price_tax": 0,
      "price_incl_tax": 229,
      "priceTax": 0,
      "priceInclTax": 229,
      "special_price_tax": 0,
      "special_price_incl_tax": 0,
      "specialPrice": 229,
      "specialPriceTax": 0,
      "specialPriceInclTax": 0,
      "final_price_tax": 0,
      "final_price_incl_tax": 229,
      "finalPrice": 229,
      "finalPriceTax": 0,
      "finalPriceInclTax": 229
    },
    {
      "short_description": "<ul>\n<li>Wooden Bed</li>\n<li>Quick Delivery</li>\n<li>Flat Slats</li>\n<li>Central Support Leg</li>\n</ul>",
      "gift_message_available": false,
      "description": "<p>The Sedna bed frame by Limelight is a classic looking wooden bed with a modern finish. The simple design of the Sedna means it will fit into any style bedroom and will give a clean and fresh feel to your bedroom through it's natural wood design.</p>\n<p>The Sedna is available in all UK standard sizes with a next day delivery option if required.</p>",
      "regular_price": 379,
      "final_price": 229,
      "price": 229,
      "special_from_date": "2020-06-03 00:00:00",
      "id": 879,
      "sku": "S02",
      "filter_size": [
        194,
        195,
        196,
        198
      ],
      "stock": {
        "is_in_stock": true,
        "stock_status": 1,
        "min_qty": 0,
        "qty": 92,
        "use_config_notify_stock_qty": true,
        "notify_stock_qty": 1
      },
      "brand": 38,
      "manufacturing_parts": [
        27
      ],
      "swatches_sample_product": 0,
      "visibility": 1,
      "meta_title": "Limelight Sedna Bedstead",
      "tax_class_id": 2,
      "weight": 10,
      "delivery_cms_block": "limelight_delivery",
      "isFabric": 0,
      "cust_pro_canonical": "100",
      "product_type_1": 26,
      "meta_description": "The Limelight Sedna Bedstead made from solid wood is a simple slatted frame to suit any bedroom. Supplied through Bed Factory direct with free delivery. ",
      "country_of_manufacture": "GB",
      "size": 49,
      "shipping_group": 1,
      "special_price": 229,
      "meta_keyword": "Limelight; Sedna; Wooden; Bed Frame; Bed Factory Direct",
      "name": "Limelight Sedna Wooden Bed-Double",
      "shipping_grouptext": "0",
      "status": 1,
      "original_price": 379,
      "original_price_tax": 0,
      "original_price_incl_tax": 379,
      "originalPrice": 379,
      "originalPriceTax": 0,
      "originalPriceInclTax": 379,
      "original_special_price": 229,
      "original_final_price": 229,
      "price_tax": 0,
      "price_incl_tax": 229,
      "priceTax": 0,
      "priceInclTax": 229,
      "special_price_tax": 0,
      "special_price_incl_tax": 0,
      "specialPrice": 229,
      "specialPriceTax": 0,
      "specialPriceInclTax": 0,
      "final_price_tax": 0,
      "final_price_incl_tax": 229,
      "finalPrice": 229,
      "finalPriceTax": 0,
      "finalPriceInclTax": 229
    },
    {
      "short_description": "<ul>\n<li>Wooden Bed</li>\n<li>Quick Delivery</li>\n<li>Flat Slats</li>\n<li>Central Support Leg</li>\n</ul>",
      "gift_message_available": false,
      "description": "<p>The Sedna bed frame by Limelight is a classic looking wooden bed with a modern finish. The simple design of the Sedna means it will fit into any style bedroom and will give a clean and fresh feel to your bedroom through it's natural wood design.</p>\n<p>The Sedna is available in all UK standard sizes with a next day delivery option if required.</p>",
      "regular_price": 429,
      "final_price": 279,
      "price": 279,
      "special_from_date": "2020-06-03 00:00:00",
      "id": 880,
      "sku": "S03",
      "filter_size": [
        194,
        195,
        196,
        198
      ],
      "stock": {
        "is_in_stock": true,
        "stock_status": 1,
        "min_qty": 0,
        "qty": 41,
        "use_config_notify_stock_qty": true,
        "notify_stock_qty": 1
      },
      "brand": 38,
      "manufacturing_parts": [
        27
      ],
      "swatches_sample_product": 0,
      "visibility": 1,
      "meta_title": "Limelight Sedna Bedstead",
      "tax_class_id": 2,
      "weight": 10,
      "delivery_cms_block": "limelight_delivery",
      "isFabric": 0,
      "cust_pro_canonical": "100",
      "product_type_1": 26,
      "meta_description": "The Limelight Sedna Bedstead made from solid wood is a simple slatted frame to suit any bedroom. Supplied through Bed Factory direct with free delivery. ",
      "country_of_manufacture": "GB",
      "size": 52,
      "shipping_group": 1,
      "special_price": 279,
      "meta_keyword": "Limelight; Sedna; Wooden; Bed Frame; Bed Factory Direct",
      "name": "Limelight Sedna Wooden Bed-King Size",
      "shipping_grouptext": "5",
      "status": 1,
      "original_price": 429,
      "original_price_tax": 0,
      "original_price_incl_tax": 429,
      "originalPrice": 429,
      "originalPriceTax": 0,
      "originalPriceInclTax": 429,
      "original_special_price": 279,
      "original_final_price": 279,
      "price_tax": 0,
      "price_incl_tax": 279,
      "priceTax": 0,
      "priceInclTax": 279,
      "special_price_tax": 0,
      "special_price_incl_tax": 0,
      "specialPrice": 279,
      "specialPriceTax": 0,
      "specialPriceInclTax": 0,
      "final_price_tax": 0,
      "final_price_incl_tax": 279,
      "finalPrice": 279,
      "finalPriceTax": 0,
      "finalPriceInclTax": 279
    }
  ],
  "category": [
    {
      "category_id": 3,
      "name": "Beds",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 16,
      "name": "Wooden Bed Frames",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 57,
      "name": "Limelight",
      "is_blacklisted": 0,
      "position": 999999
    }
  ],
  "shipping_grouptext": "0",
  "status": 1,
  "attributes_metadata": [
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Product Name",
      "attribute_id": 73,
      "id": 73,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "name"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "SKU",
      "attribute_id": 74,
      "id": 74,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": true,
      "attribute_code": "sku"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Description",
      "attribute_id": 75,
      "id": 75,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": true,
      "attribute_code": "description"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Short Description",
      "attribute_id": 76,
      "id": 76,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": true,
      "attribute_code": "short_description"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Price",
      "attribute_id": 77,
      "id": 77,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "price"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Special Price",
      "attribute_id": 78,
      "id": 78,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "special_price"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Special Price From Date",
      "attribute_id": 79,
      "id": 79,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "special_from_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Special Price To Date",
      "attribute_id": 80,
      "id": 80,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "special_to_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Cost",
      "attribute_id": 81,
      "id": 81,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "cost"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Weight",
      "attribute_id": 82,
      "id": 82,
      "entity_type_id": 4,
      "frontend_input": "weight",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "weight"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Manufacturer",
      "attribute_id": 83,
      "id": 83,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "manufacturer"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Meta Title",
      "attribute_id": 84,
      "id": 84,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "meta_title"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Meta Keywords",
      "attribute_id": 85,
      "id": 85,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "meta_keyword"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Meta Description",
      "attribute_id": 86,
      "id": 86,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "meta_description"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Base",
      "attribute_id": 87,
      "id": 87,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "image"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Small",
      "attribute_id": 88,
      "id": 88,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "small_image"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Thumbnail",
      "attribute_id": 89,
      "id": 89,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "thumbnail"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Media Gallery",
      "attribute_id": 90,
      "id": 90,
      "entity_type_id": 4,
      "frontend_input": "gallery",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "media_gallery"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Tier Price",
      "attribute_id": 92,
      "id": 92,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "tier_price"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Color",
      "attribute_id": 93,
      "id": 93,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "color"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Set Product as New from Date",
      "attribute_id": 94,
      "id": 94,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "news_from_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Set Product as New to Date",
      "attribute_id": 95,
      "id": 95,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "news_to_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Image Gallery",
      "attribute_id": 96,
      "id": 96,
      "entity_type_id": 4,
      "frontend_input": "gallery",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "gallery"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Enable Product",
      "attribute_id": 97,
      "options": [
        {
          "label": "Enabled",
          "value": "1"
        }
      ],
      "id": 97,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "status"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Visibility",
      "attribute_id": 99,
      "options": [
        {
          "label": "Not Visible Individually",
          "value": "1"
        },
        {
          "label": "Catalog, Search",
          "value": "4"
        }
      ],
      "id": 99,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "visibility"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "New Theme",
      "attribute_id": 100,
      "options": [
        {
          "label": "-- Please Select --",
          "value": ""
        }
      ],
      "id": 100,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_design"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Active From",
      "attribute_id": 101,
      "id": 101,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_design_from"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Active To",
      "attribute_id": 102,
      "id": 102,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_design_to"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Layout",
      "attribute_id": 104,
      "options": [
        {
          "label": "No layout updates",
          "value": ""
        }
      ],
      "id": 104,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "page_layout"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Categories",
      "attribute_id": 105,
      "id": 105,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "category_ids"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Display Product Options In",
      "attribute_id": 106,
      "id": 106,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "options_container"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Country of Manufacture",
      "attribute_id": 114,
      "options": [
        {
          "label": "United Kingdom",
          "value": "GB"
        }
      ],
      "id": 114,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "country_of_manufacture"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Quantity",
      "attribute_id": 115,
      "id": 115,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "quantity_and_stock_status"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "New Layout",
      "attribute_id": 116,
      "options": [
        {
          "label": "No layout updates",
          "value": ""
        }
      ],
      "id": 116,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_layout"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Minimum Advertised Price",
      "attribute_id": 117,
      "id": 117,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "msrp"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Display Actual Price",
      "attribute_id": 118,
      "options": [
        {
          "label": "Use config",
          "value": "0"
        }
      ],
      "id": 118,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "msrp_display_actual_price_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "URL Key",
      "attribute_id": 121,
      "id": 121,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "url_key"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Dynamic Price",
      "attribute_id": 127,
      "id": 127,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "price_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Dynamic SKU",
      "attribute_id": 128,
      "id": 128,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "sku_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Dynamic Weight",
      "attribute_id": 129,
      "id": 129,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "weight_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Price View",
      "attribute_id": 130,
      "id": 130,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "price_view"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Ship Bundle Items",
      "attribute_id": 131,
      "id": 131,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "shipment_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Allow Gift Message",
      "attribute_id": 132,
      "options": [
        {
          "label": "No",
          "value": "0"
        }
      ],
      "id": 132,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "gift_message_available"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Swatch",
      "attribute_id": 133,
      "id": 133,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "swatch_image"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Tax Class",
      "attribute_id": 134,
      "options": [
        {
          "label": "Taxable Goods",
          "value": "2"
        }
      ],
      "id": 134,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "tax_class_id"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "product type",
      "attribute_id": 145,
      "options": [
        {
          "label": "non bfd",
          "value": "26",
          "sort_order": 2
        }
      ],
      "id": 145,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "product_type_1"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "manufacturing parts",
      "attribute_id": 146,
      "options": [
        {
          "label": "none",
          "value": "27",
          "sort_order": 1
        }
      ],
      "id": 146,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "manufacturing_parts"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Brand",
      "attribute_id": 149,
      "options": [
        {
          "label": "Limelight",
          "value": "38",
          "sort_order": 5
        }
      ],
      "id": 149,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "brand"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Size",
      "attribute_id": 152,
      "options": [
        {
          "label": "Single",
          "value": "47",
          "sort_order": 1
        },
        {
          "label": "Small Double",
          "value": "48",
          "sort_order": 2
        },
        {
          "label": "Double",
          "value": "49",
          "sort_order": 3
        },
        {
          "label": "King Size",
          "value": "52",
          "sort_order": 4
        }
      ],
      "id": 152,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "size"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Colour",
      "attribute_id": 153,
      "id": 153,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "colour"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Custom Product Canonical URL",
      "attribute_id": 159,
      "id": 159,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "cust_pro_canonical"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "specs",
      "attribute_id": 165,
      "id": 165,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "specs"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Storage Drawers",
      "attribute_id": 166,
      "id": 166,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "storage_drawers"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Shipping Group",
      "attribute_id": 167,
      "options": [
        {
          "label": "2 Man Delivery",
          "value": "1"
        }
      ],
      "id": 167,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "shipping_group"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Shipping Group lead days",
      "attribute_id": 168,
      "id": 168,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "shipping_grouptext"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Is Fabric",
      "attribute_id": 169,
      "options": [
        {
          "label": "No",
          "value": "0"
        }
      ],
      "id": 169,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "isFabric"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Sample Atrribute",
      "attribute_id": 170,
      "id": 170,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "sample_attribute"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Fabric Type",
      "attribute_id": 171,
      "options": [
        {
          "label": "Please Select Option",
          "value": ""
        }
      ],
      "id": 171,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "isFabrics"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Filter Size",
      "attribute_id": 173,
      "options": [
        {
          "label": "Single",
          "value": "194",
          "sort_order": 1
        },
        {
          "label": "Small Double",
          "value": "195",
          "sort_order": 2
        },
        {
          "label": "Double",
          "value": "196",
          "sort_order": 3
        },
        {
          "label": "Super King",
          "value": "198",
          "sort_order": 5
        },
        {
          "label": "King",
          "value": "197",
          "sort_order": 4
        }
      ],
      "id": 173,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "filter_size"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Comfort Grade",
      "attribute_id": 174,
      "id": 174,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "comfort_grade"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Swatches Sample Product",
      "attribute_id": 177,
      "options": [
        {
          "label": "No",
          "value": "0"
        }
      ],
      "id": 177,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "swatches_sample_product"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Option Group",
      "attribute_id": 179,
      "id": 179,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "option_group"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Delivery Tab CMS Block",
      "attribute_id": 180,
      "options": [
        {
          "label": "Delivery - Limelight",
          "value": "limelight_delivery"
        }
      ],
      "id": 180,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "delivery_cms_block"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Mattress Type",
      "attribute_id": 182,
      "id": 182,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "mattress_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Configuration",
      "attribute_id": 185,
      "id": 185,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "product_configuration"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Furniture Range",
      "attribute_id": 186,
      "id": 186,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "furniture_range"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Ottoman Lift",
      "attribute_id": 187,
      "id": 187,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "ottoman_lift"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Custom Layout Update",
      "attribute_id": 188,
      "id": 188,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_layout_update_file"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Imegamedia Finance Filter",
      "attribute_id": 200,
      "id": 200,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "imegamedia_finance_filter"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Total Reviews",
      "attribute_id": 201,
      "id": 201,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "total_reviews"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Average Score",
      "attribute_id": 202,
      "id": 202,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "average_score"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Stock Check",
      "attribute_id": 203,
      "options": [
        {
          "label": "No",
          "value": "0"
        }
      ],
      "id": 203,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "isStock"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Guarantee",
      "attribute_id": 204,
      "id": 204,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "guarantee"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Product Label",
      "attribute_id": 205,
      "options": [
        {
          "label": "Yes",
          "value": "1"
        }
      ],
      "id": 205,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "product_label"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Front Label Type",
      "attribute_id": 207,
      "id": 207,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "front_label_image_name"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Fragrance",
      "attribute_id": 208,
      "id": 208,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "fragrance"
    }
  ],
  "isStock": 0,
  "original_price": 379,
  "original_price_tax": 0,
  "original_price_incl_tax": 379,
  "originalPrice": 379,
  "originalPriceTax": 0,
  "originalPriceInclTax": 379,
  "original_special_price": 229,
  "original_final_price": 229,
  "price_tax": 0,
  "price_incl_tax": 229,
  "priceTax": 0,
  "priceInclTax": 229,
  "special_price_tax": 0,
  "special_price_incl_tax": 0,
  "specialPrice": 229,
  "specialPriceTax": 0,
  "specialPriceInclTax": 0,
  "final_price_tax": 0,
  "final_price_incl_tax": 229,
  "finalPrice": 229,
  "finalPriceTax": 0,
  "finalPriceInclTax": 229,
  "_score": 27.680676,
  "qty": 1,
  "errors": {},
  "info": {},
  "parentSku": "Limelight Sedna Wooden Bed",
  "parentId": 815,
  "product_option": {
    "extension_attributes": {
      "custom_options": [],
      "configurable_item_options": [
        {
          "option_id": "152",
          "option_value": "49"
        }
      ],
      "bundle_options": []
    }
  },
  "options": [
    {
      "label": "Size",
      "value": "Double"
    }
  ],
  "is_configured": true,
  "special_from_date": "2020-06-03 00:00:00",
  "size": 49
}
      const diffLog = await this.$store.dispatch('cart/addItem', {
        productToAdd: configurable
      });
      console.log('789456 Product adding to cart');
      diffLog.clientNotifications.forEach(notificationData => {
        console.log('789456 Successfully added', notificationData);
        // this.notifyUser(notificationData)
      });
      this.$bus.$emit('notification-progress-stop');
    },
    async addQuote (quoteId,index) {
      console.log("36521 Here to add quote ",quoteId,index ,this.quoteData[index]);
      this.quoteData[index].items.forEach((product,productIndex)=>{
        console.log("36521 current product in qoute is ", product);
        const URL = config.baseUrl.url+"vueapi/ext/V12Finance/getSku";
        let order = {
          "item_id": product.itemid,
          "quote_id": quoteId
        }
        axios.post(URL, order, {
          headers: {
            "Content-type": "application/json"
          }
        })
          .then(res => {
            console.log("36521 Data received for ",product.name, res ,"\n\n",JSON.stringify(res.data.result));
            let testProduct={
  "weight": 10,
  "average_score": 4.8542,
  "price": 259,
  "id": 452,
  "filter_size": [
    194,
    195,
    196,
    197,
    198
  ],
  "stock": {
    "is_in_stock": true,
    "max_sale_qty": 10000,
    "stock_status": 1,
    "min_sale_qty": 1,
    "item_id": 528,
    "backorders": false,
    "min_qty": 0,
    "product_id": 452,
    "qty": 10000000,
    "is_qty_decimal": false,
    "low_stock_date": null
  },
  "slug": "cavali-divan-bed",
  "manufacturing_parts": [
    28,
    29
  ],
  "comfort_grade": [
    205
  ],
  "attributes_metadata": [
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Product Name",
      "attribute_id": 73,
      "id": 73,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "name"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "SKU",
      "attribute_id": 74,
      "id": 74,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": true,
      "attribute_code": "sku"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Description",
      "attribute_id": 75,
      "id": 75,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": true,
      "attribute_code": "description"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Short Description",
      "attribute_id": 76,
      "id": 76,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": true,
      "attribute_code": "short_description"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Price",
      "attribute_id": 77,
      "id": 77,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "price"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Special Price",
      "attribute_id": 78,
      "id": 78,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "special_price"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Special Price From Date",
      "attribute_id": 79,
      "id": 79,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "special_from_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Special Price To Date",
      "attribute_id": 80,
      "id": 80,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "special_to_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Cost",
      "attribute_id": 81,
      "id": 81,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "cost"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Weight",
      "attribute_id": 82,
      "id": 82,
      "entity_type_id": 4,
      "frontend_input": "weight",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "weight"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Manufacturer",
      "attribute_id": 83,
      "id": 83,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "manufacturer"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Meta Title",
      "attribute_id": 84,
      "id": 84,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "meta_title"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Meta Keywords",
      "attribute_id": 85,
      "id": 85,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "meta_keyword"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Meta Description",
      "attribute_id": 86,
      "id": 86,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "meta_description"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Base",
      "attribute_id": 87,
      "id": 87,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "image"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Small",
      "attribute_id": 88,
      "id": 88,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "small_image"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Thumbnail",
      "attribute_id": 89,
      "id": 89,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "thumbnail"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Media Gallery",
      "attribute_id": 90,
      "id": 90,
      "entity_type_id": 4,
      "frontend_input": "gallery",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "media_gallery"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Tier Price",
      "attribute_id": 92,
      "id": 92,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "tier_price"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Color",
      "attribute_id": 93,
      "id": 93,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "color"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Set Product as New from Date",
      "attribute_id": 94,
      "id": 94,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "news_from_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Set Product as New to Date",
      "attribute_id": 95,
      "id": 95,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "news_to_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Image Gallery",
      "attribute_id": 96,
      "id": 96,
      "entity_type_id": 4,
      "frontend_input": "gallery",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "gallery"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Enable Product",
      "attribute_id": 97,
      "options": [
        {
          "label": "Enabled",
          "value": "1"
        }
      ],
      "id": 97,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "status"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Visibility",
      "attribute_id": 99,
      "options": [
        {
          "label": "Catalog, Search",
          "value": "4"
        }
      ],
      "id": 99,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "visibility"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "New Theme",
      "attribute_id": 100,
      "options": [
        {
          "label": "-- Please Select --",
          "value": ""
        }
      ],
      "id": 100,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_design"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Active From",
      "attribute_id": 101,
      "id": 101,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_design_from"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Active To",
      "attribute_id": 102,
      "id": 102,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_design_to"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Layout",
      "attribute_id": 104,
      "options": [
        {
          "label": "No layout updates",
          "value": ""
        }
      ],
      "id": 104,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "page_layout"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Categories",
      "attribute_id": 105,
      "id": 105,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "category_ids"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Display Product Options In",
      "attribute_id": 106,
      "id": 106,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "options_container"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Country of Manufacture",
      "attribute_id": 114,
      "options": [
        {
          "label": "United Kingdom",
          "value": "GB"
        }
      ],
      "id": 114,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "country_of_manufacture"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Quantity",
      "attribute_id": 115,
      "id": 115,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "quantity_and_stock_status"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "New Layout",
      "attribute_id": 116,
      "options": [
        {
          "label": "No layout updates",
          "value": ""
        }
      ],
      "id": 116,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_layout"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Minimum Advertised Price",
      "attribute_id": 117,
      "id": 117,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "msrp"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Display Actual Price",
      "attribute_id": 118,
      "options": [
        {
          "label": "Use config",
          "value": "0"
        }
      ],
      "id": 118,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "msrp_display_actual_price_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "URL Key",
      "attribute_id": 121,
      "id": 121,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "url_key"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Dynamic Price",
      "attribute_id": 127,
      "id": 127,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "price_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Dynamic SKU",
      "attribute_id": 128,
      "id": 128,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "sku_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Dynamic Weight",
      "attribute_id": 129,
      "id": 129,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "weight_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Price View",
      "attribute_id": 130,
      "id": 130,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "price_view"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Ship Bundle Items",
      "attribute_id": 131,
      "id": 131,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "shipment_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Allow Gift Message",
      "attribute_id": 132,
      "options": [
        {
          "label": "Yes",
          "value": "1"
        }
      ],
      "id": 132,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "gift_message_available"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Swatch",
      "attribute_id": 133,
      "id": 133,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "swatch_image"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Tax Class",
      "attribute_id": 134,
      "options": [
        {
          "label": "Taxable Goods",
          "value": "2"
        }
      ],
      "id": 134,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "tax_class_id"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "product type",
      "attribute_id": 145,
      "options": [
        {
          "label": "bfd",
          "value": "25",
          "sort_order": 1
        }
      ],
      "id": 145,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "product_type_1"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "manufacturing parts",
      "attribute_id": 146,
      "options": [
        {
          "label": "base",
          "value": "28",
          "sort_order": 2
        },
        {
          "label": "mattress",
          "value": "29",
          "sort_order": 3
        }
      ],
      "id": 146,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "manufacturing_parts"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Brand",
      "attribute_id": 149,
      "options": [
        {
          "label": "Bed Factory",
          "value": "34",
          "sort_order": 1
        }
      ],
      "id": 149,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "brand"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Size",
      "attribute_id": 152,
      "id": 152,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "size"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Colour",
      "attribute_id": 153,
      "id": 153,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "colour"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Custom Product Canonical URL",
      "attribute_id": 159,
      "id": 159,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "cust_pro_canonical"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "specs",
      "attribute_id": 165,
      "id": 165,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "specs"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Storage Drawers",
      "attribute_id": 166,
      "id": 166,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "storage_drawers"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Shipping Group",
      "attribute_id": 167,
      "options": [
        {
          "label": "2 Man Delivery",
          "value": "1"
        }
      ],
      "id": 167,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "shipping_group"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Shipping Group lead days",
      "attribute_id": 168,
      "id": 168,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "shipping_grouptext"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Is Fabric",
      "attribute_id": 169,
      "options": [
        {
          "label": "Yes",
          "value": "1"
        }
      ],
      "id": 169,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "isFabric"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Sample Atrribute",
      "attribute_id": 170,
      "id": 170,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "sample_attribute"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Fabric Type",
      "attribute_id": 171,
      "options": [
        {
          "label": "Chenille",
          "value": "0"
        }
      ],
      "id": 171,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "isFabrics"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Filter Size",
      "attribute_id": 173,
      "options": [
        {
          "label": "Single",
          "value": "194",
          "sort_order": 1
        },
        {
          "label": "Small Double",
          "value": "195",
          "sort_order": 2
        },
        {
          "label": "Double",
          "value": "196",
          "sort_order": 3
        },
        {
          "label": "King",
          "value": "197",
          "sort_order": 4
        },
        {
          "label": "Super King",
          "value": "198",
          "sort_order": 5
        }
      ],
      "id": 173,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "filter_size"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Comfort Grade",
      "attribute_id": 174,
      "options": [
        {
          "label": "3-Medium",
          "value": "205",
          "sort_order": 3
        }
      ],
      "id": 174,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "comfort_grade"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Swatches Sample Product",
      "attribute_id": 177,
      "options": [
        {
          "label": "No",
          "value": "0"
        }
      ],
      "id": 177,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "swatches_sample_product"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Option Group",
      "attribute_id": 179,
      "options": [
        {
          "label": "Chenille Fabrics",
          "value": "chenille_fabrics"
        },
        {
          "label": "Faux Leather Fabrics",
          "value": "faux_leather_fabrics"
        },
        {
          "label": "Faux Suede Fabrics",
          "value": "faux_suede_fabrics"
        },
        {
          "label": "Crushed Velvet Fabrics",
          "value": "crushed_velvet_fabrics"
        },
        {
          "label": "Luxury Velvet Fabrics",
          "value": "luxury_velvet_fabrics"
        },
        {
          "label": "Premium Fabrics",
          "value": "premium_fabrics"
        }
      ],
      "id": 179,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "option_group"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Delivery Tab CMS Block",
      "attribute_id": 180,
      "options": [
        {
          "label": "Delivery - Standard Bed Frame",
          "value": "standard_frame_delivery"
        }
      ],
      "id": 180,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "delivery_cms_block"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Mattress Type",
      "attribute_id": 182,
      "options": [
        {
          "label": "Open Coil",
          "value": "220",
          "sort_order": 2
        }
      ],
      "id": 182,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "mattress_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Configuration",
      "attribute_id": 185,
      "id": 185,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "product_configuration"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Furniture Range",
      "attribute_id": 186,
      "id": 186,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "furniture_range"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Ottoman Lift",
      "attribute_id": 187,
      "id": 187,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "ottoman_lift"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Custom Layout Update",
      "attribute_id": 188,
      "id": 188,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_layout_update_file"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Imegamedia Finance Filter",
      "attribute_id": 200,
      "id": 200,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "imegamedia_finance_filter"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Total Reviews",
      "attribute_id": 201,
      "id": 201,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "total_reviews"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Average Score",
      "attribute_id": 202,
      "id": 202,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "average_score"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Stock Check",
      "attribute_id": 203,
      "options": [
        {
          "label": "No",
          "value": "0"
        }
      ],
      "id": 203,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "isStock"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Guarantee",
      "attribute_id": 204,
      "id": 204,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "guarantee"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Product Label",
      "attribute_id": 205,
      "options": [
        {
          "label": "Yes",
          "value": "1"
        }
      ],
      "id": 205,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "product_label"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Front Label Type",
      "attribute_id": 207,
      "options": [
        {
          "label": "Please Select Option",
          "value": "0"
        }
      ],
      "id": 207,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "front_label_image_name"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Fragrance",
      "attribute_id": 208,
      "id": 208,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "fragrance"
    }
  ],
  "option_group": [
    "chenille_fabrics",
    "faux_leather_fabrics",
    "faux_suede_fabrics",
    "crushed_velvet_fabrics",
    "luxury_velvet_fabrics",
    "premium_fabrics"
  ],
  "tsk": 1643202894,
  "regular_price": 299,
  "final_price": 259,
  "product_links": [
    {
      "link_type": "crosssell",
      "linked_product_sku": "MP2MattressProtector",
      "linked_product_type": "configurable",
      "position": 1,
      "sku": "cavali-divan-bed"
    },
    {
      "link_type": "crosssell",
      "linked_product_sku": "Luxury Hotel Duvet Cover And Pillowcases",
      "linked_product_type": "simple",
      "position": 2,
      "sku": "cavali-divan-bed"
    },
    {
      "link_type": "crosssell",
      "linked_product_sku": "Bed Factory Essential Pillows",
      "linked_product_type": "simple",
      "position": 3,
      "sku": "cavali-divan-bed"
    },
    {
      "link_type": "crosssell",
      "linked_product_sku": "Tranquil Pillow",
      "linked_product_type": "simple",
      "position": 4,
      "sku": "cavali-divan-bed"
    },
    {
      "link_type": "crosssell",
      "linked_product_sku": "Divan Bed Removal",
      "linked_product_type": "simple",
      "position": 5,
      "sku": "cavali-divan-bed"
    },
    {
      "link_type": "crosssell",
      "linked_product_sku": "Divan Bed Assembly",
      "linked_product_type": "simple",
      "position": 6,
      "sku": "cavali-divan-bed"
    }
  ],
  "url_path": "cavali-divan-bed",
  "media_gallery": [
    {
      "image": "/2/-/2-drawers-side_20.jpg",
      "pos": 2,
      "typ": "image",
      "lab": "cavali divan bed"
    },
    {
      "image": "/c/a/cavali_grey.jpg",
      "pos": 2,
      "typ": "image",
      "lab": "cavali divan bed"
    },
    {
      "image": "/c/h/chrome-feet_20.jpg",
      "pos": 3,
      "typ": "image",
      "lab": "cavali divan bed"
    }
  ],
  "custom_options": [
    {
      "image_size_x": "0",
      "image_size_y": "0",
      "max_characters": "0",
      "price": 0,
      "values": [
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 0,
          "option_type_id": "17409",
          "logo": "",
          "price_type": "fixed",
          "sku": "3ft",
          "title": "Single",
          "sort_order": 0,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 120,
          "option_type_id": "17410",
          "logo": "",
          "price_type": "fixed",
          "sku": "4ft",
          "title": "Small Double",
          "sort_order": 1,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 120,
          "option_type_id": "17411",
          "logo": "",
          "price_type": "fixed",
          "sku": "4ft6",
          "title": "Double",
          "sort_order": 2,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 170,
          "option_type_id": "17412",
          "logo": "",
          "price_type": "fixed",
          "sku": "5ft",
          "title": "King",
          "sort_order": 3,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 240,
          "option_type_id": "17413",
          "logo": "",
          "price_type": "fixed",
          "sku": "6ft",
          "title": "Super King",
          "sort_order": 4,
          "layer": null
        }
      ],
      "price_type": null,
      "option_id": 13,
      "iscolor": "0",
      "is_require": true,
      "type": "select",
      "title": "Size",
      "sort_order": 1
    },
    {
      "image_size_x": "0",
      "image_size_y": "0",
      "max_characters": "0",
      "price": 0,
      "values": [
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 0,
          "option_type_id": "17414",
          "logo": "",
          "price_type": "fixed",
          "sku": "standard",
          "title": "No Storage",
          "sort_order": 0,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 60,
          "option_type_id": "17415",
          "logo": "",
          "price_type": "fixed",
          "sku": "2drs",
          "title": "2 Drawers Side",
          "sort_order": 1,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 60,
          "option_type_id": "17416",
          "logo": "",
          "price_type": "fixed",
          "sku": "2dre",
          "title": "2 Drawers End",
          "sort_order": 2,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 100,
          "option_type_id": "17417",
          "logo": "",
          "price_type": "fixed",
          "sku": "4dr",
          "title": "4 Drawers",
          "sort_order": 3,
          "layer": null
        }
      ],
      "price_type": null,
      "option_id": 14,
      "iscolor": "",
      "is_require": true,
      "type": "select",
      "title": "Storage",
      "sort_order": 2
    },
    {
      "image_size_x": "0",
      "image_size_y": "0",
      "max_characters": "0",
      "price": 0,
      "values": [
        {
          "image": "",
          "colour": "Purple",
          "quantity": "",
          "price": 10,
          "option_type_id": "168776",
          "logo": "",
          "price_type": "fixed",
          "sku": "aubchen",
          "title": "Aubergine Chenille",
          "sort_order": 1,
          "layer": "/../../productreview/tmp/image/aubergine-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Black ",
          "quantity": "",
          "price": 0,
          "option_type_id": "168777",
          "logo": "",
          "price_type": "fixed",
          "sku": "blkchen",
          "title": "Black Chenille",
          "sort_order": 2,
          "layer": "/../../productreview/tmp/image/black-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168778",
          "logo": "",
          "price_type": "fixed",
          "sku": "brnchen",
          "title": "Brown Chenille",
          "sort_order": 3,
          "layer": "/../../productreview/tmp/image/brown-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Charcoal",
          "quantity": "",
          "price": 0,
          "option_type_id": "168779",
          "logo": "",
          "price_type": "fixed",
          "sku": "charchen",
          "title": "Charcoal Chenille",
          "sort_order": 4,
          "layer": "/../../productreview/tmp/image/charocal-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168780",
          "logo": "",
          "price_type": "fixed",
          "sku": "grychen",
          "title": "Grey Chenille",
          "sort_order": 5,
          "layer": "/../../productreview/tmp/image/grey-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Cream",
          "quantity": "",
          "price": 0,
          "option_type_id": "168781",
          "logo": "",
          "price_type": "fixed",
          "sku": "natchen",
          "title": "Natural Chenille",
          "sort_order": 6,
          "layer": "/../../productreview/tmp/image/natural-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Purple",
          "quantity": "",
          "price": 0,
          "option_type_id": "168782",
          "logo": "",
          "price_type": "fixed",
          "sku": "purchen",
          "title": "Purple Chenille",
          "sort_order": 7,
          "layer": "/../../productreview/tmp/image/purple-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Sand",
          "quantity": "",
          "price": 0,
          "option_type_id": "168783",
          "logo": "",
          "price_type": "fixed",
          "sku": "sanchen",
          "title": "Sand Chenille",
          "sort_order": 8,
          "layer": "/../../productreview/tmp/image/sand-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Cream",
          "quantity": "",
          "price": 0,
          "option_type_id": "168784",
          "logo": "",
          "price_type": "fixed",
          "sku": "stochen",
          "title": "Stone Chenille",
          "sort_order": 9,
          "layer": "/../../productreview/tmp/image/stone-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Teal",
          "quantity": "",
          "price": 0,
          "option_type_id": "168785",
          "logo": "",
          "price_type": "fixed",
          "sku": "techen",
          "title": "Teal Chenille",
          "sort_order": 10,
          "layer": "/../../productreview/tmp/image/teal-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Black",
          "quantity": "",
          "price": 0,
          "option_type_id": "168786",
          "logo": "",
          "price_type": "fixed",
          "sku": "blkfaux",
          "title": "Black Faux Leather",
          "sort_order": 11,
          "layer": "/../../productreview/tmp/image/black-faux-leather.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168787",
          "logo": "",
          "price_type": "fixed",
          "sku": "brnfaux",
          "title": "Brown Faux Leather",
          "sort_order": 12,
          "layer": "/../../productreview/tmp/image/brown-faux-leather.jpg"
        },
        {
          "image": "",
          "colour": "Cream",
          "quantity": "",
          "price": 0,
          "option_type_id": "168788",
          "logo": "",
          "price_type": "fixed",
          "sku": "crmfaux",
          "title": "Cream Faux Leather",
          "sort_order": 13,
          "layer": "/../../productreview/tmp/image/cream-faux-leather.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168789",
          "logo": "",
          "price_type": "fixed",
          "sku": "gryfaux",
          "title": "Grey Faux Leather",
          "sort_order": 14,
          "layer": "/../../productreview/tmp/image/grey-faux-leather.jpg"
        },
        {
          "image": "",
          "colour": "White",
          "quantity": "",
          "price": 0,
          "option_type_id": "168790",
          "logo": "",
          "price_type": "fixed",
          "sku": "whtfaux",
          "title": "White Faux Leather",
          "sort_order": 15,
          "layer": "/../../productreview/tmp/image/white-faux-leather.jpg"
        },
        {
          "image": "",
          "colour": "Black",
          "quantity": "",
          "price": 0,
          "option_type_id": "168791",
          "logo": "",
          "price_type": "fixed",
          "sku": "blkfauxs",
          "title": "Black Faux Suede",
          "sort_order": 16,
          "layer": "/../../productreview/tmp/image/black-suede.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168792",
          "logo": "",
          "price_type": "fixed",
          "sku": "brnfauxs",
          "title": "Brown Faux Suede",
          "sort_order": 17,
          "layer": "/../../productreview/tmp/image/brown-suede.jpg"
        },
        {
          "image": "",
          "colour": "Cream",
          "quantity": "",
          "price": 0,
          "option_type_id": "168793",
          "logo": "",
          "price_type": "fixed",
          "sku": "crmfaux",
          "title": "Cream Faux Suede",
          "sort_order": 18,
          "layer": "/../../productreview/tmp/image/cream-suede.jpg"
        },
        {
          "image": "",
          "colour": "Ivory",
          "quantity": "",
          "price": 0,
          "option_type_id": "168794",
          "logo": "",
          "price_type": "fixed",
          "sku": "cshvi",
          "title": "Crushed Velvet Ivory",
          "sort_order": 19,
          "layer": "/../../productreview/tmp/image/crushed-velvet-ivory.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168795",
          "logo": "",
          "price_type": "fixed",
          "sku": "cshvs",
          "title": "Crushed Velvet Steel",
          "sort_order": 20,
          "layer": "/../../productreview/tmp/image/crushed-velvet-steel.jpg"
        },
        {
          "image": "",
          "colour": "Black",
          "quantity": "",
          "price": 0,
          "option_type_id": "168796",
          "logo": "",
          "price_type": "fixed",
          "sku": "blkluxv",
          "title": "Black Luxury Velvet",
          "sort_order": 21,
          "layer": "/../../productreview/tmp/image/luxury-velvet-ebony.jpg"
        },
        {
          "image": "",
          "colour": "Blue",
          "quantity": "",
          "price": 0,
          "option_type_id": "168797",
          "logo": "",
          "price_type": "fixed",
          "sku": "mluxv",
          "title": "Marine Luxury Velvet",
          "sort_order": 22,
          "layer": "/../../productreview/tmp/image/luxury-velvet-marine.jpg"
        },
        {
          "image": "",
          "colour": "Mink",
          "quantity": "",
          "price": 0,
          "option_type_id": "168798",
          "logo": "",
          "price_type": "fixed",
          "sku": "minluxv",
          "title": "Mink Luxury Velvet",
          "sort_order": 23,
          "layer": "/../../productreview/tmp/image/luxury-velvet-mink.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168799",
          "logo": "",
          "price_type": "fixed",
          "sku": "pluxv",
          "title": "Pebble Luxury Velvet",
          "sort_order": 24,
          "layer": "/../../productreview/tmp/image/luxury-velvet-pebble.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168800",
          "logo": "",
          "price_type": "fixed",
          "sku": "stluxv",
          "title": "Steel Luxury Velvet",
          "sort_order": 25,
          "layer": "/../../productreview/tmp/image/luxury-velvet-steel.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168801",
          "logo": "",
          "price_type": "fixed",
          "sku": "arrantruf",
          "title": "Arrran Truffle",
          "sort_order": 26,
          "layer": "/../../productreview/tmp/image/Arran-truffle.jpg"
        },
        {
          "image": "",
          "colour": "Blue",
          "quantity": "",
          "price": 0,
          "option_type_id": "168802",
          "logo": "",
          "price_type": "fixed",
          "sku": "atalntic",
          "title": "Atlantic",
          "sort_order": 27,
          "layer": "/../../productreview/tmp/image/atlantic.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168803",
          "logo": "",
          "price_type": "fixed",
          "sku": "bertruf",
          "title": "Berwick Truffle",
          "sort_order": 28,
          "layer": "/../../productreview/tmp/image/berwick-truffle.jpg"
        },
        {
          "image": "",
          "colour": "Cream",
          "quantity": "",
          "price": 0,
          "option_type_id": "168804",
          "logo": "",
          "price_type": "fixed",
          "sku": "brackbe",
          "title": "Bracken Beige",
          "sort_order": 29,
          "layer": "/../../productreview/tmp/image/bracken-beige.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168805",
          "logo": "",
          "price_type": "fixed",
          "sku": "brackchar",
          "title": "Bracken Charcoal",
          "sort_order": 30,
          "layer": "/../../productreview/tmp/image/bracken-charcoal.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168806",
          "logo": "",
          "price_type": "fixed",
          "sku": "conc",
          "title": "Concrete ",
          "sort_order": 31,
          "layer": "/../../productreview/tmp/image/concrete.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168807",
          "logo": "",
          "price_type": "fixed",
          "sku": "countb",
          "title": "Country Beige",
          "sort_order": 32,
          "layer": "/../../productreview/tmp/image/country-beige.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168808",
          "logo": "",
          "price_type": "fixed",
          "sku": "gracegra",
          "title": "Graceland Graphite",
          "sort_order": 34,
          "layer": "/../../productreview/tmp/image/graceland-graphite.jpg"
        },
        {
          "image": "",
          "colour": "Pink",
          "quantity": "",
          "price": 0,
          "option_type_id": "168809",
          "logo": "",
          "price_type": "fixed",
          "sku": "gracepnk",
          "title": "Graceland Pink",
          "sort_order": 35,
          "layer": "/../../productreview/tmp/image/graceland-ping.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168810",
          "logo": "",
          "price_type": "fixed",
          "sku": "gracesil",
          "title": "Graceland SIlver",
          "sort_order": 36,
          "layer": "/../../productreview/tmp/image/graceland-silver_1.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168811",
          "logo": "",
          "price_type": "fixed",
          "sku": "hessian",
          "title": "Hessian Fabric",
          "sort_order": 38,
          "layer": "/../../productreview/tmp/image/hessian.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168812",
          "logo": "",
          "price_type": "fixed",
          "sku": "jeffc",
          "title": "Jeff Clay",
          "sort_order": 39,
          "layer": "/../../productreview/tmp/image/jeff-clay.jpg"
        },
        {
          "image": "",
          "colour": "Gey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168813",
          "logo": "",
          "price_type": "fixed",
          "sku": "linslt",
          "title": "Linette Slate",
          "sort_order": 40,
          "layer": "/../../productreview/tmp/image/linetta-slate.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168814",
          "logo": "",
          "price_type": "fixed",
          "sku": "quarry",
          "title": "Quarry",
          "sort_order": 41,
          "layer": "/../../productreview/tmp/image/quarry.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168815",
          "logo": "",
          "price_type": "fixed",
          "sku": "wooll",
          "title": "Wool Latte",
          "sort_order": 42,
          "layer": "/../../productreview/tmp/image/wool-latte.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168816",
          "logo": "",
          "price_type": "fixed",
          "sku": "wools",
          "title": "Wool Steel",
          "sort_order": 43,
          "layer": "/../../productreview/tmp/image/wool-steel.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168817",
          "logo": "",
          "price_type": "fixed",
          "sku": "mercury",
          "title": "Mercury",
          "sort_order": 44,
          "layer": "/../../productreview/tmp/image/mercury.jpg"
        }
      ],
      "price_type": null,
      "option_id": 6604,
      "iscolor": "1",
      "is_require": true,
      "type": "select",
      "title": "Fabrics",
      "sort_order": 10
    }
  ],
  "mattress_type": [
    220
  ],
  "category": [
    {
      "category_id": 3,
      "name": "Beds",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 13,
      "name": "Divan Beds",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 77,
      "name": "Open Coil Divans",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 51,
      "name": "Bed Factory Direct",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 100,
      "name": "Divan Beds Sale",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 119,
      "name": "Black Friday Divan Beds",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 121,
      "name": "Black Friday Deals",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 124,
      "name": "Cyber Week Divan Beds",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 92,
      "name": "Snooze Zone",
      "is_blacklisted": 0,
      "position": 1
    }
  ],
  "isStock": 0,
  "original_price": 299,
  "original_price_tax": 0,
  "original_price_incl_tax": 299,
  "originalPrice": 299,
  "originalPriceTax": 0,
  "originalPriceInclTax": 299,
  "original_special_price": 259,
  "original_final_price": 259,
  "price_tax": 0,
  "price_incl_tax": 259,
  "priceTax": 0,
  "priceInclTax": 259,
  "special_price_tax": 0,
  "special_price_incl_tax": 0,
  "specialPrice": 259,
  "specialPriceTax": 0,
  "specialPriceInclTax": 0,
  "final_price_tax": 0,
  "final_price_incl_tax": 259,
  "finalPrice": 259,
  "finalPriceTax": 0,
  "finalPriceInclTax": 259,
  "_score": 32.457558,
  "qty": 1,
  "errors": {
    "custom_options": null,
    "custom_options_customOption_13": null,
    "custom_options_customOption_14": null,
    "custom_options_customOption_6604": null
  },
  "info": {},
  "parentSku": "cavali-divan-bed",
  "parentId": 452,
  "product_option": {
    "extension_attributes": {
      "custom_options": {
        "13": {
          "option_id": 13,
          "option_value": "17411"
        },
        "14": {
          "option_id": 14,
          "option_value": "17417"
        },
        "6604": {
          "option_id": 6604,
          "option_value": "168790"
        }
      },
      "configurable_item_options": [],
      "bundle_options": []
    }
  },
  "type_id": "configurable",
  "sku": "cavali-divan-bed",
  "status": "1",
  "visibility": "4",
  "tax_class_id": "2",
  "product_type_1": "25",
  "brand": "34",
  "shipping_group": "1",
  "isFabric": "1",
  "isFabrics": "0",
  "swatches_sample_product": "0",
  "total_reviews": "48",
  "product_label": "1",
  "description": "<p>The Cavali divan bed is a smart, modern divan with both a comfortable mattress and an attractive looking base. The mattress of this bed is a traditional sprung mattress finished in a quilted damask fabric. The mattress is hand tufted, making the fillings densely packed and adding extra durability to your mattress.</p>\n<p>The base of the Cavali divan is available in a choice of modern chenille fabrics, giving you great flexibility if you need the bed to fit into a particular colour scheme. You can also add storage options to the base if you could benefit from the extra space in keeping your bedroom neat and tidy.</p>\n<p>The bed photographed is upholstered in Wool Steel fabric with our <span style=\"text-decoration: underline;\"><a href=\"https://bedfactorydirect.co.uk/coniston-22-chenille-headboard\">Coniston headboard</a></span>. Don't forget to add the headboard to your basket to complete the look of your new Divan.</p>",
  "short_description": "<ul>\n<li>Medium Firmness</li>\n<li>Hand Tufted</li>\n<li>Turnable</li>\n<li>Choice Of Colours</li>\n<li>Storage Options</li>\n</ul>",
  "meta_keyword": "Sleepover Divan Bed",
  "specs": "<p><strong>Divan Size</strong></p>\n<ul>\n<li>Single - (3'0\" x 6'3\") / (90 x 190cm)</li>\n<li>Small Double - (4'0\" x 6'3\") / (120 x 190cm)</li>\n<li>Double - (4'6\" x 6'3\") / (135 x 190cm)</li>\n<li>King - (5'0\" x 6'6\") / (150 x 200cm)</li>\n<li>Super King - (6'0\" x 6'6\") / (180 x 200cm)</li>\n</ul>\n<p><strong>Mattress Depth</strong></p>\n<ul>\n<li>10\" / 25cm</li>\n</ul>\n<p><strong>Base Depth</strong></p>\n<ul>\n<li>15.5\" / 39cm (Including Feet)</li>\n</ul>\n<p><strong>Drawer Dimensions </strong></p>\n<ul>\n<li>Height - 9\" / 23cm</li>\n<li>Width - 29\" / 74cm</li>\n<li>Depth - 20.5\" / 52cm</li>\n<li>Internal Storage - 7\" / 18cm</li>\n</ul>\n<p><strong>Storage Options</strong></p>\n<p><img src=\"https://admin.bedfactorydirect.co.uk/pub/media/storage-options-guide.jpg\" alt=\"storage options guide\" width=\"100%\" /></p>\n<p style=\"font-size: 12px;\">* All measurements are approximate and are subject to a tolerance of + or - 2cm</p>",
  "shipping_grouptext": "3",
  "name": "Cavali Divan Bed",
  "meta_title": "Cavali Divan Bed",
  "meta_description": "The Amazing Cavali divan bed has a deep hand tufted turnable mattress, full of luxury and support. Available in a rainbow of colours, this bed also has the option to add storage drawers if you need extra storage space.",
  "image": "/c/a/cavali_grey.jpg",
  "thumbnail": "/c/a/cavali_grey.jpg",
  "country_of_manufacture": "GB",
  "url_key": "cavali-divan-bed",
  "gift_message_available": "2",
  "cust_pro_canonical": "100",
  "delivery_cms_block": "standard_frame_delivery",
  "front_label_image_name": "0",
  "special_price": 259,
  "special_from_date": "2020-04-06 00:00:00",
  "category_ids": [
    3,
    13,
    77,
    51,
    100,
    119,
    121,
    124,
    92
  ]
}
 let newTestProduct = {
  "id": 452,
  "stock": {
    "is_in_stock": true,
    "max_sale_qty": 10000,
    "stock_status": 1,
    "min_sale_qty": 1,
    "item_id": 528,
    "backorders": false,
    "min_qty": 0,
    "product_id": 452,
    "qty": 10000000,
    "is_qty_decimal": false,
    "low_stock_date": null
  },
  "slug": "cavali-divan-bed",
  "comfort_grade": [
    205
  ],
  "tsk": 1643202894,
  "regular_price": 299,
  "final_price": 259,
  "product_links": [
    {
      "link_type": "crosssell",
      "linked_product_sku": "MP2MattressProtector",
      "linked_product_type": "configurable",
      "position": 1,
      "sku": "cavali-divan-bed"
    },
    {
      "link_type": "crosssell",
      "linked_product_sku": "Luxury Hotel Duvet Cover And Pillowcases",
      "linked_product_type": "simple",
      "position": 2,
      "sku": "cavali-divan-bed"
    },
    {
      "link_type": "crosssell",
      "linked_product_sku": "Bed Factory Essential Pillows",
      "linked_product_type": "simple",
      "position": 3,
      "sku": "cavali-divan-bed"
    },
    {
      "link_type": "crosssell",
      "linked_product_sku": "Tranquil Pillow",
      "linked_product_type": "simple",
      "position": 4,
      "sku": "cavali-divan-bed"
    },
    {
      "link_type": "crosssell",
      "linked_product_sku": "Divan Bed Removal",
      "linked_product_type": "simple",
      "position": 5,
      "sku": "cavali-divan-bed"
    },
    {
      "link_type": "crosssell",
      "linked_product_sku": "Divan Bed Assembly",
      "linked_product_type": "simple",
      "position": 6,
      "sku": "cavali-divan-bed"
    }
  ],
  "url_path": "cavali-divan-bed",
  "media_gallery": [
    {
      "image": "/2/-/2-drawers-side_20.jpg",
      "pos": 2,
      "typ": "image",
      "lab": "cavali divan bed"
    },
    {
      "image": "/c/a/cavali_grey.jpg",
      "pos": 2,
      "typ": "image",
      "lab": "cavali divan bed"
    },
    {
      "image": "/c/h/chrome-feet_20.jpg",
      "pos": 3,
      "typ": "image",
      "lab": "cavali divan bed"
    }
  ],
  "custom_options": [
    {
      "image_size_x": "0",
      "image_size_y": "0",
      "max_characters": "0",
      "price": 0,
      "values": [
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 0,
          "option_type_id": "17409",
          "logo": "",
          "price_type": "fixed",
          "sku": "3ft",
          "title": "Single",
          "sort_order": 0,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 120,
          "option_type_id": "17410",
          "logo": "",
          "price_type": "fixed",
          "sku": "4ft",
          "title": "Small Double",
          "sort_order": 1,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 120,
          "option_type_id": "17411",
          "logo": "",
          "price_type": "fixed",
          "sku": "4ft6",
          "title": "Double",
          "sort_order": 2,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 170,
          "option_type_id": "17412",
          "logo": "",
          "price_type": "fixed",
          "sku": "5ft",
          "title": "King",
          "sort_order": 3,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 240,
          "option_type_id": "17413",
          "logo": "",
          "price_type": "fixed",
          "sku": "6ft",
          "title": "Super King",
          "sort_order": 4,
          "layer": null
        }
      ],
      "price_type": null,
      "option_id": 13,
      "iscolor": "0",
      "is_require": true,
      "type": "select",
      "title": "Size",
      "sort_order": 1
    },
    {
      "image_size_x": "0",
      "image_size_y": "0",
      "max_characters": "0",
      "price": 0,
      "values": [
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 0,
          "option_type_id": "17414",
          "logo": "",
          "price_type": "fixed",
          "sku": "standard",
          "title": "No Storage",
          "sort_order": 0,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 60,
          "option_type_id": "17415",
          "logo": "",
          "price_type": "fixed",
          "sku": "2drs",
          "title": "2 Drawers Side",
          "sort_order": 1,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 60,
          "option_type_id": "17416",
          "logo": "",
          "price_type": "fixed",
          "sku": "2dre",
          "title": "2 Drawers End",
          "sort_order": 2,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 100,
          "option_type_id": "17417",
          "logo": "",
          "price_type": "fixed",
          "sku": "4dr",
          "title": "4 Drawers",
          "sort_order": 3,
          "layer": null
        }
      ],
      "price_type": null,
      "option_id": 14,
      "iscolor": "",
      "is_require": true,
      "type": "select",
      "title": "Storage",
      "sort_order": 2
    },
    {
      "image_size_x": "0",
      "image_size_y": "0",
      "max_characters": "0",
      "price": 0,
      "values": [
        {
          "image": "",
          "colour": "Purple",
          "quantity": "",
          "price": 10,
          "option_type_id": "168776",
          "logo": "",
          "price_type": "fixed",
          "sku": "aubchen",
          "title": "Aubergine Chenille",
          "sort_order": 1,
          "layer": "/../../productreview/tmp/image/aubergine-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Black ",
          "quantity": "",
          "price": 0,
          "option_type_id": "168777",
          "logo": "",
          "price_type": "fixed",
          "sku": "blkchen",
          "title": "Black Chenille",
          "sort_order": 2,
          "layer": "/../../productreview/tmp/image/black-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168778",
          "logo": "",
          "price_type": "fixed",
          "sku": "brnchen",
          "title": "Brown Chenille",
          "sort_order": 3,
          "layer": "/../../productreview/tmp/image/brown-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Charcoal",
          "quantity": "",
          "price": 0,
          "option_type_id": "168779",
          "logo": "",
          "price_type": "fixed",
          "sku": "charchen",
          "title": "Charcoal Chenille",
          "sort_order": 4,
          "layer": "/../../productreview/tmp/image/charocal-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168780",
          "logo": "",
          "price_type": "fixed",
          "sku": "grychen",
          "title": "Grey Chenille",
          "sort_order": 5,
          "layer": "/../../productreview/tmp/image/grey-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Cream",
          "quantity": "",
          "price": 0,
          "option_type_id": "168781",
          "logo": "",
          "price_type": "fixed",
          "sku": "natchen",
          "title": "Natural Chenille",
          "sort_order": 6,
          "layer": "/../../productreview/tmp/image/natural-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Purple",
          "quantity": "",
          "price": 0,
          "option_type_id": "168782",
          "logo": "",
          "price_type": "fixed",
          "sku": "purchen",
          "title": "Purple Chenille",
          "sort_order": 7,
          "layer": "/../../productreview/tmp/image/purple-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Sand",
          "quantity": "",
          "price": 0,
          "option_type_id": "168783",
          "logo": "",
          "price_type": "fixed",
          "sku": "sanchen",
          "title": "Sand Chenille",
          "sort_order": 8,
          "layer": "/../../productreview/tmp/image/sand-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Cream",
          "quantity": "",
          "price": 0,
          "option_type_id": "168784",
          "logo": "",
          "price_type": "fixed",
          "sku": "stochen",
          "title": "Stone Chenille",
          "sort_order": 9,
          "layer": "/../../productreview/tmp/image/stone-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Teal",
          "quantity": "",
          "price": 0,
          "option_type_id": "168785",
          "logo": "",
          "price_type": "fixed",
          "sku": "techen",
          "title": "Teal Chenille",
          "sort_order": 10,
          "layer": "/../../productreview/tmp/image/teal-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Black",
          "quantity": "",
          "price": 0,
          "option_type_id": "168786",
          "logo": "",
          "price_type": "fixed",
          "sku": "blkfaux",
          "title": "Black Faux Leather",
          "sort_order": 11,
          "layer": "/../../productreview/tmp/image/black-faux-leather.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168787",
          "logo": "",
          "price_type": "fixed",
          "sku": "brnfaux",
          "title": "Brown Faux Leather",
          "sort_order": 12,
          "layer": "/../../productreview/tmp/image/brown-faux-leather.jpg"
        },
        {
          "image": "",
          "colour": "Cream",
          "quantity": "",
          "price": 0,
          "option_type_id": "168788",
          "logo": "",
          "price_type": "fixed",
          "sku": "crmfaux",
          "title": "Cream Faux Leather",
          "sort_order": 13,
          "layer": "/../../productreview/tmp/image/cream-faux-leather.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168789",
          "logo": "",
          "price_type": "fixed",
          "sku": "gryfaux",
          "title": "Grey Faux Leather",
          "sort_order": 14,
          "layer": "/../../productreview/tmp/image/grey-faux-leather.jpg"
        },
        {
          "image": "",
          "colour": "White",
          "quantity": "",
          "price": 0,
          "option_type_id": "168790",
          "logo": "",
          "price_type": "fixed",
          "sku": "whtfaux",
          "title": "White Faux Leather",
          "sort_order": 15,
          "layer": "/../../productreview/tmp/image/white-faux-leather.jpg"
        },
        {
          "image": "",
          "colour": "Black",
          "quantity": "",
          "price": 0,
          "option_type_id": "168791",
          "logo": "",
          "price_type": "fixed",
          "sku": "blkfauxs",
          "title": "Black Faux Suede",
          "sort_order": 16,
          "layer": "/../../productreview/tmp/image/black-suede.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168792",
          "logo": "",
          "price_type": "fixed",
          "sku": "brnfauxs",
          "title": "Brown Faux Suede",
          "sort_order": 17,
          "layer": "/../../productreview/tmp/image/brown-suede.jpg"
        },
        {
          "image": "",
          "colour": "Cream",
          "quantity": "",
          "price": 0,
          "option_type_id": "168793",
          "logo": "",
          "price_type": "fixed",
          "sku": "crmfaux",
          "title": "Cream Faux Suede",
          "sort_order": 18,
          "layer": "/../../productreview/tmp/image/cream-suede.jpg"
        },
        {
          "image": "",
          "colour": "Ivory",
          "quantity": "",
          "price": 0,
          "option_type_id": "168794",
          "logo": "",
          "price_type": "fixed",
          "sku": "cshvi",
          "title": "Crushed Velvet Ivory",
          "sort_order": 19,
          "layer": "/../../productreview/tmp/image/crushed-velvet-ivory.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168795",
          "logo": "",
          "price_type": "fixed",
          "sku": "cshvs",
          "title": "Crushed Velvet Steel",
          "sort_order": 20,
          "layer": "/../../productreview/tmp/image/crushed-velvet-steel.jpg"
        },
        {
          "image": "",
          "colour": "Black",
          "quantity": "",
          "price": 0,
          "option_type_id": "168796",
          "logo": "",
          "price_type": "fixed",
          "sku": "blkluxv",
          "title": "Black Luxury Velvet",
          "sort_order": 21,
          "layer": "/../../productreview/tmp/image/luxury-velvet-ebony.jpg"
        },
        {
          "image": "",
          "colour": "Blue",
          "quantity": "",
          "price": 0,
          "option_type_id": "168797",
          "logo": "",
          "price_type": "fixed",
          "sku": "mluxv",
          "title": "Marine Luxury Velvet",
          "sort_order": 22,
          "layer": "/../../productreview/tmp/image/luxury-velvet-marine.jpg"
        },
        {
          "image": "",
          "colour": "Mink",
          "quantity": "",
          "price": 0,
          "option_type_id": "168798",
          "logo": "",
          "price_type": "fixed",
          "sku": "minluxv",
          "title": "Mink Luxury Velvet",
          "sort_order": 23,
          "layer": "/../../productreview/tmp/image/luxury-velvet-mink.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168799",
          "logo": "",
          "price_type": "fixed",
          "sku": "pluxv",
          "title": "Pebble Luxury Velvet",
          "sort_order": 24,
          "layer": "/../../productreview/tmp/image/luxury-velvet-pebble.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168800",
          "logo": "",
          "price_type": "fixed",
          "sku": "stluxv",
          "title": "Steel Luxury Velvet",
          "sort_order": 25,
          "layer": "/../../productreview/tmp/image/luxury-velvet-steel.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168801",
          "logo": "",
          "price_type": "fixed",
          "sku": "arrantruf",
          "title": "Arrran Truffle",
          "sort_order": 26,
          "layer": "/../../productreview/tmp/image/Arran-truffle.jpg"
        },
        {
          "image": "",
          "colour": "Blue",
          "quantity": "",
          "price": 0,
          "option_type_id": "168802",
          "logo": "",
          "price_type": "fixed",
          "sku": "atalntic",
          "title": "Atlantic",
          "sort_order": 27,
          "layer": "/../../productreview/tmp/image/atlantic.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168803",
          "logo": "",
          "price_type": "fixed",
          "sku": "bertruf",
          "title": "Berwick Truffle",
          "sort_order": 28,
          "layer": "/../../productreview/tmp/image/berwick-truffle.jpg"
        },
        {
          "image": "",
          "colour": "Cream",
          "quantity": "",
          "price": 0,
          "option_type_id": "168804",
          "logo": "",
          "price_type": "fixed",
          "sku": "brackbe",
          "title": "Bracken Beige",
          "sort_order": 29,
          "layer": "/../../productreview/tmp/image/bracken-beige.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168805",
          "logo": "",
          "price_type": "fixed",
          "sku": "brackchar",
          "title": "Bracken Charcoal",
          "sort_order": 30,
          "layer": "/../../productreview/tmp/image/bracken-charcoal.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168806",
          "logo": "",
          "price_type": "fixed",
          "sku": "conc",
          "title": "Concrete ",
          "sort_order": 31,
          "layer": "/../../productreview/tmp/image/concrete.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168807",
          "logo": "",
          "price_type": "fixed",
          "sku": "countb",
          "title": "Country Beige",
          "sort_order": 32,
          "layer": "/../../productreview/tmp/image/country-beige.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168808",
          "logo": "",
          "price_type": "fixed",
          "sku": "gracegra",
          "title": "Graceland Graphite",
          "sort_order": 34,
          "layer": "/../../productreview/tmp/image/graceland-graphite.jpg"
        },
        {
          "image": "",
          "colour": "Pink",
          "quantity": "",
          "price": 0,
          "option_type_id": "168809",
          "logo": "",
          "price_type": "fixed",
          "sku": "gracepnk",
          "title": "Graceland Pink",
          "sort_order": 35,
          "layer": "/../../productreview/tmp/image/graceland-ping.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168810",
          "logo": "",
          "price_type": "fixed",
          "sku": "gracesil",
          "title": "Graceland SIlver",
          "sort_order": 36,
          "layer": "/../../productreview/tmp/image/graceland-silver_1.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168811",
          "logo": "",
          "price_type": "fixed",
          "sku": "hessian",
          "title": "Hessian Fabric",
          "sort_order": 38,
          "layer": "/../../productreview/tmp/image/hessian.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168812",
          "logo": "",
          "price_type": "fixed",
          "sku": "jeffc",
          "title": "Jeff Clay",
          "sort_order": 39,
          "layer": "/../../productreview/tmp/image/jeff-clay.jpg"
        },
        {
          "image": "",
          "colour": "Gey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168813",
          "logo": "",
          "price_type": "fixed",
          "sku": "linslt",
          "title": "Linette Slate",
          "sort_order": 40,
          "layer": "/../../productreview/tmp/image/linetta-slate.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168814",
          "logo": "",
          "price_type": "fixed",
          "sku": "quarry",
          "title": "Quarry",
          "sort_order": 41,
          "layer": "/../../productreview/tmp/image/quarry.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168815",
          "logo": "",
          "price_type": "fixed",
          "sku": "wooll",
          "title": "Wool Latte",
          "sort_order": 42,
          "layer": "/../../productreview/tmp/image/wool-latte.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168816",
          "logo": "",
          "price_type": "fixed",
          "sku": "wools",
          "title": "Wool Steel",
          "sort_order": 43,
          "layer": "/../../productreview/tmp/image/wool-steel.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168817",
          "logo": "",
          "price_type": "fixed",
          "sku": "mercury",
          "title": "Mercury",
          "sort_order": 44,
          "layer": "/../../productreview/tmp/image/mercury.jpg"
        }
      ],
      "price_type": null,
      "option_id": 6604,
      "iscolor": "1",
      "is_require": true,
      "type": "select",
      "title": "Fabrics",
      "sort_order": 10
    }
  ],
  "isStock": 0,
  "original_price": 299,
  "original_price_tax": 0,
  "original_price_incl_tax": 299,
  "originalPrice": 299,
  "originalPriceTax": 0,
  "originalPriceInclTax": 299,
  "original_special_price": 259,
  "original_final_price": 259,
  "price_tax": 0,
  "price_incl_tax": 259,
  "priceTax": 0,
  "priceInclTax": 259,
  "special_price_tax": 0,
  "special_price_incl_tax": 0,
  "specialPrice": 259,
  "specialPriceTax": 0,
  "specialPriceInclTax": 0,
  "final_price_tax": 0,
  "final_price_incl_tax": 259,
  "finalPrice": 259,
  "finalPriceTax": 0,
  "finalPriceInclTax": 259,
  "qty": 1,
  "product_option": {
    "extension_attributes": {
      "custom_options": {
        "13": {
          "option_id": 13,
          "option_value": "17411"
        },
        "14": {
          "option_id": 14,
          "option_value": "17417"
        },
        "6604": {
          "option_id": 6604,
          "option_value": "168790"
        }
      },
      "configurable_item_options": [],
      "bundle_options": []
    }
  },
  "type_id": "simple",
  "sku": "cavali-divan-bed",
  "has_options": "1",
  "required_options": "1",
  "created_at": "2020-05-06 12:30:13",
  "updated_at": "2022-01-14 06:42:06",
  "status": "1",
  "visibility": "4",
  "tax_class_id": "2",
  "product_type_1": "25",
  "brand": "34",
  "shipping_group": "1",
  "isFabric": "1",
  "isFabrics": "0",
  "swatches_sample_product": "0",
  "total_reviews": "48",
  "product_label": "1",
  "fragrance": "309",
  "description": "<p>The Cavali divan bed is a smart, modern divan with both a comfortable mattress and an attractive looking base. The mattress of this bed is a traditional sprung mattress finished in a quilted damask fabric. The mattress is hand tufted, making the fillings densely packed and adding extra durability to your mattress.</p>\n<p>The base of the Cavali divan is available in a choice of modern chenille fabrics, giving you great flexibility if you need the bed to fit into a particular colour scheme. You can also add storage options to the base if you could benefit from the extra space in keeping your bedroom neat and tidy.</p>\n<p>The bed photographed is upholstered in Wool Steel fabric with our <span style=\"text-decoration: underline;\"><a href=\"https://bedfactorydirect.co.uk/coniston-22-chenille-headboard\">Coniston headboard</a></span>. Don't forget to add the headboard to your basket to complete the look of your new Divan.</p>",
  "short_description": "<ul>\n<li>Medium Firmness</li>\n<li>Hand Tufted</li>\n<li>Turnable</li>\n<li>Choice Of Colours</li>\n<li>Storage Options</li>\n</ul>",
  "meta_keyword": "Sleepover Divan Bed",
  "specs": "<p><strong>Divan Size</strong></p>\n<ul>\n<li>Single - (3'0\" x 6'3\") / (90 x 190cm)</li>\n<li>Small Double - (4'0\" x 6'3\") / (120 x 190cm)</li>\n<li>Double - (4'6\" x 6'3\") / (135 x 190cm)</li>\n<li>King - (5'0\" x 6'6\") / (150 x 200cm)</li>\n<li>Super King - (6'0\" x 6'6\") / (180 x 200cm)</li>\n</ul>\n<p><strong>Mattress Depth</strong></p>\n<ul>\n<li>10\" / 25cm</li>\n</ul>\n<p><strong>Base Depth</strong></p>\n<ul>\n<li>15.5\" / 39cm (Including Feet)</li>\n</ul>\n<p><strong>Drawer Dimensions </strong></p>\n<ul>\n<li>Height - 9\" / 23cm</li>\n<li>Width - 29\" / 74cm</li>\n<li>Depth - 20.5\" / 52cm</li>\n<li>Internal Storage - 7\" / 18cm</li>\n</ul>\n<p><strong>Storage Options</strong></p>\n<p><img src=\"https://admin.bedfactorydirect.co.uk/pub/media/storage-options-guide.jpg\" alt=\"storage options guide\" width=\"100%\" /></p>\n<p style=\"font-size: 12px;\">* All measurements are approximate and are subject to a tolerance of + or - 2cm</p>",
  "shipping_grouptext": "3",
  "name": "Cavali Divan Bed",
  "meta_title": "Cavali Divan Bed",
  "meta_description": "The Amazing Cavali divan bed has a deep hand tufted turnable mattress, full of luxury and support. Available in a rainbow of colours, this bed also has the option to add storage drawers if you need extra storage space.",
  "image": "/c/a/cavali_grey.jpg",
  "small_image": "/c/a/cavali_grey.jpg",
  "thumbnail": "/c/a/cavali_grey.jpg",
  "options_container": "container2",
  "image_label": "cavali divan bed",
  "small_image_label": "cavali divan bed",
  "thumbnail_label": "cavali divan bed",
  "country_of_manufacture": "GB",
  "msrp_display_actual_price_type": "0",
  "url_key": "cavali-divan-bed",
  "gift_message_available": "2",
  "swatch_image": "/c/a/cavali_grey.jpg",
  "cust_pro_canonical": "100",
  "delivery_cms_block": "standard_frame_delivery",
  "front_label_image_name": "0",
  "price": "299.000000",
  "special_price": 259,
  "weight": "10.000000",
  "average_score": "4.854200",
  "special_from_date": "2020-04-06 00:00:00",
  "category_ids": [
    3,
    13,
    77,
    51,
    100,
    119,
    121,
    124,
    92
  ],
  "is_salable": 1
}
let workingProduct = {
  "average_score": 4.8542,
  "gift_message_available": true,
  "front_label_image_name": "0",
  "specs": "<p><strong>Divan Size</strong></p>\n<ul>\n<li>Single - (3'0\" x 6'3\") / (90 x 190cm)</li>\n<li>Small Double - (4'0\" x 6'3\") / (120 x 190cm)</li>\n<li>Double - (4'6\" x 6'3\") / (135 x 190cm)</li>\n<li>King - (5'0\" x 6'6\") / (150 x 200cm)</li>\n<li>Super King - (6'0\" x 6'6\") / (180 x 200cm)</li>\n</ul>\n<p><strong>Mattress Depth</strong></p>\n<ul>\n<li>10\" / 25cm</li>\n</ul>\n<p><strong>Base Depth</strong></p>\n<ul>\n<li>15.5\" / 39cm (Including Feet)</li>\n</ul>\n<p><strong>Drawer Dimensions </strong></p>\n<ul>\n<li>Height - 9\" / 23cm</li>\n<li>Width - 29\" / 74cm</li>\n<li>Depth - 20.5\" / 52cm</li>\n<li>Internal Storage - 7\" / 18cm</li>\n</ul>\n<p><strong>Storage Options</strong></p>\n<p><img src=\"https://admin.bedfactorydirect.co.uk/pub/media/storage-options-guide.jpg\" alt=\"storage options guide\" width=\"100%\" /></p>\n<p style=\"font-size: 12px;\">* All measurements are approximate and are subject to a tolerance of + or - 2cm</p>",
  "product_label": 1,
  "price": 259,
  "special_from_date": "2020-04-06 00:00:00",
  "id": 452,
  "category_ids": [
    3,
    13,
    77,
    51,
    100,
    119,
    121,
    124,
    92
  ],
  "sku": "cavali-divan-bed",
  "filter_size": [
    194,
    195,
    196,
    197,
    198
  ],
  "stock": {
    "is_in_stock": true,
    "max_sale_qty": 10000,
    "stock_status": 1,
    "min_sale_qty": 1,
    "item_id": 528,
    "backorders": false,
    "min_qty": 0,
    "product_id": 452,
    "qty": 10000000,
    "is_qty_decimal": false,
    "low_stock_date": null
  },
  "brand": 34,
  "slug": "cavali-divan-bed",
  "image": "/c/a/cavali_grey.jpg",
  "thumbnail": "/c/a/cavali_grey.jpg",
  "manufacturing_parts": [
    28,
    29
  ],
  "swatches_sample_product": 0,
  "visibility": 4,
  "meta_title": "Cavali Divan Bed",
  "weight": 10,
  "isFabrics": 0,
  "isFabric": 1,
  "product_type_1": 25,
  "meta_description": "The Amazing Cavali divan bed has a deep hand tufted turnable mattress, full of luxury and support. Available in a rainbow of colours, this bed also has the option to add storage drawers if you need extra storage space.",
  "country_of_manufacture": "GB",
  "comfort_grade": [
    205
  ],
  "meta_keyword": "Sleepover Divan Bed",
  "name": "Cavali Divan Bed",
  "shipping_grouptext": "3",
  "status": 1,
  "attributes_metadata": [
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Product Name",
      "attribute_id": 73,
      "id": 73,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "name"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "SKU",
      "attribute_id": 74,
      "id": 74,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": true,
      "attribute_code": "sku"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Description",
      "attribute_id": 75,
      "id": 75,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": true,
      "attribute_code": "description"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Short Description",
      "attribute_id": 76,
      "id": 76,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": true,
      "attribute_code": "short_description"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Price",
      "attribute_id": 77,
      "id": 77,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "price"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Special Price",
      "attribute_id": 78,
      "id": 78,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "special_price"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Special Price From Date",
      "attribute_id": 79,
      "id": 79,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "special_from_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Special Price To Date",
      "attribute_id": 80,
      "id": 80,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "special_to_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Cost",
      "attribute_id": 81,
      "id": 81,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "cost"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Weight",
      "attribute_id": 82,
      "id": 82,
      "entity_type_id": 4,
      "frontend_input": "weight",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "weight"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Manufacturer",
      "attribute_id": 83,
      "id": 83,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "manufacturer"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Meta Title",
      "attribute_id": 84,
      "id": 84,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "meta_title"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Meta Keywords",
      "attribute_id": 85,
      "id": 85,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "meta_keyword"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Meta Description",
      "attribute_id": 86,
      "id": 86,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "meta_description"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Base",
      "attribute_id": 87,
      "id": 87,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "image"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Small",
      "attribute_id": 88,
      "id": 88,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "small_image"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Thumbnail",
      "attribute_id": 89,
      "id": 89,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "thumbnail"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Media Gallery",
      "attribute_id": 90,
      "id": 90,
      "entity_type_id": 4,
      "frontend_input": "gallery",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "media_gallery"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Tier Price",
      "attribute_id": 92,
      "id": 92,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "tier_price"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Color",
      "attribute_id": 93,
      "id": 93,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "color"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Set Product as New from Date",
      "attribute_id": 94,
      "id": 94,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "news_from_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Set Product as New to Date",
      "attribute_id": 95,
      "id": 95,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "news_to_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Image Gallery",
      "attribute_id": 96,
      "id": 96,
      "entity_type_id": 4,
      "frontend_input": "gallery",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "gallery"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Enable Product",
      "attribute_id": 97,
      "options": [
        {
          "label": "Enabled",
          "value": "1"
        }
      ],
      "id": 97,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "status"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Visibility",
      "attribute_id": 99,
      "options": [
        {
          "label": "Catalog, Search",
          "value": "4"
        }
      ],
      "id": 99,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "visibility"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "New Theme",
      "attribute_id": 100,
      "options": [
        {
          "label": "-- Please Select --",
          "value": ""
        }
      ],
      "id": 100,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_design"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Active From",
      "attribute_id": 101,
      "id": 101,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_design_from"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Active To",
      "attribute_id": 102,
      "id": 102,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_design_to"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Layout",
      "attribute_id": 104,
      "options": [
        {
          "label": "No layout updates",
          "value": ""
        }
      ],
      "id": 104,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "page_layout"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Categories",
      "attribute_id": 105,
      "id": 105,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "category_ids"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Display Product Options In",
      "attribute_id": 106,
      "id": 106,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "options_container"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Country of Manufacture",
      "attribute_id": 114,
      "options": [
        {
          "label": "United Kingdom",
          "value": "GB"
        }
      ],
      "id": 114,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "country_of_manufacture"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Quantity",
      "attribute_id": 115,
      "id": 115,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "quantity_and_stock_status"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "New Layout",
      "attribute_id": 116,
      "options": [
        {
          "label": "No layout updates",
          "value": ""
        }
      ],
      "id": 116,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_layout"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Minimum Advertised Price",
      "attribute_id": 117,
      "id": 117,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "msrp"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Display Actual Price",
      "attribute_id": 118,
      "options": [
        {
          "label": "Use config",
          "value": "0"
        }
      ],
      "id": 118,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "msrp_display_actual_price_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "URL Key",
      "attribute_id": 121,
      "id": 121,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "url_key"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Dynamic Price",
      "attribute_id": 127,
      "id": 127,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "price_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Dynamic SKU",
      "attribute_id": 128,
      "id": 128,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "sku_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Dynamic Weight",
      "attribute_id": 129,
      "id": 129,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "weight_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Price View",
      "attribute_id": 130,
      "id": 130,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "price_view"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Ship Bundle Items",
      "attribute_id": 131,
      "id": 131,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "shipment_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Allow Gift Message",
      "attribute_id": 132,
      "options": [
        {
          "label": "Yes",
          "value": "1"
        }
      ],
      "id": 132,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "gift_message_available"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Swatch",
      "attribute_id": 133,
      "id": 133,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "swatch_image"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Tax Class",
      "attribute_id": 134,
      "options": [
        {
          "label": "Taxable Goods",
          "value": "2"
        }
      ],
      "id": 134,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "tax_class_id"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "product type",
      "attribute_id": 145,
      "options": [
        {
          "label": "bfd",
          "value": "25",
          "sort_order": 1
        }
      ],
      "id": 145,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "product_type_1"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "manufacturing parts",
      "attribute_id": 146,
      "options": [
        {
          "label": "base",
          "value": "28",
          "sort_order": 2
        },
        {
          "label": "mattress",
          "value": "29",
          "sort_order": 3
        }
      ],
      "id": 146,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "manufacturing_parts"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Brand",
      "attribute_id": 149,
      "options": [
        {
          "label": "Bed Factory",
          "value": "34",
          "sort_order": 1
        }
      ],
      "id": 149,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "brand"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Size",
      "attribute_id": 152,
      "id": 152,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "size"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Colour",
      "attribute_id": 153,
      "id": 153,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "colour"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Custom Product Canonical URL",
      "attribute_id": 159,
      "id": 159,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "cust_pro_canonical"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "specs",
      "attribute_id": 165,
      "id": 165,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "specs"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Storage Drawers",
      "attribute_id": 166,
      "id": 166,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "storage_drawers"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Shipping Group",
      "attribute_id": 167,
      "options": [
        {
          "label": "2 Man Delivery",
          "value": "1"
        }
      ],
      "id": 167,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "shipping_group"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Shipping Group lead days",
      "attribute_id": 168,
      "id": 168,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "shipping_grouptext"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Is Fabric",
      "attribute_id": 169,
      "options": [
        {
          "label": "Yes",
          "value": "1"
        }
      ],
      "id": 169,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "isFabric"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Sample Atrribute",
      "attribute_id": 170,
      "id": 170,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "sample_attribute"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Fabric Type",
      "attribute_id": 171,
      "options": [
        {
          "label": "Chenille",
          "value": "0"
        }
      ],
      "id": 171,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "isFabrics"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Filter Size",
      "attribute_id": 173,
      "options": [
        {
          "label": "Single",
          "value": "194",
          "sort_order": 1
        },
        {
          "label": "Small Double",
          "value": "195",
          "sort_order": 2
        },
        {
          "label": "Double",
          "value": "196",
          "sort_order": 3
        },
        {
          "label": "King",
          "value": "197",
          "sort_order": 4
        },
        {
          "label": "Super King",
          "value": "198",
          "sort_order": 5
        }
      ],
      "id": 173,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "filter_size"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Comfort Grade",
      "attribute_id": 174,
      "options": [
        {
          "label": "3-Medium",
          "value": "205",
          "sort_order": 3
        }
      ],
      "id": 174,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "comfort_grade"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Swatches Sample Product",
      "attribute_id": 177,
      "options": [
        {
          "label": "No",
          "value": "0"
        }
      ],
      "id": 177,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "swatches_sample_product"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Option Group",
      "attribute_id": 179,
      "options": [
        {
          "label": "Chenille Fabrics",
          "value": "chenille_fabrics"
        },
        {
          "label": "Faux Leather Fabrics",
          "value": "faux_leather_fabrics"
        },
        {
          "label": "Faux Suede Fabrics",
          "value": "faux_suede_fabrics"
        },
        {
          "label": "Crushed Velvet Fabrics",
          "value": "crushed_velvet_fabrics"
        },
        {
          "label": "Luxury Velvet Fabrics",
          "value": "luxury_velvet_fabrics"
        },
        {
          "label": "Premium Fabrics",
          "value": "premium_fabrics"
        }
      ],
      "id": 179,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "option_group"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Delivery Tab CMS Block",
      "attribute_id": 180,
      "options": [
        {
          "label": "Delivery - Standard Bed Frame",
          "value": "standard_frame_delivery"
        }
      ],
      "id": 180,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "delivery_cms_block"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Mattress Type",
      "attribute_id": 182,
      "options": [
        {
          "label": "Open Coil",
          "value": "220",
          "sort_order": 2
        }
      ],
      "id": 182,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "mattress_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Configuration",
      "attribute_id": 185,
      "id": 185,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "product_configuration"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Furniture Range",
      "attribute_id": 186,
      "id": 186,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "furniture_range"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Ottoman Lift",
      "attribute_id": 187,
      "id": 187,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "ottoman_lift"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Custom Layout Update",
      "attribute_id": 188,
      "id": 188,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_layout_update_file"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Imegamedia Finance Filter",
      "attribute_id": 200,
      "id": 200,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "imegamedia_finance_filter"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Total Reviews",
      "attribute_id": 201,
      "id": 201,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "total_reviews"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Average Score",
      "attribute_id": 202,
      "id": 202,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "average_score"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Stock Check",
      "attribute_id": 203,
      "options": [
        {
          "label": "No",
          "value": "0"
        }
      ],
      "id": 203,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "isStock"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Guarantee",
      "attribute_id": 204,
      "id": 204,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "guarantee"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Product Label",
      "attribute_id": 205,
      "options": [
        {
          "label": "Yes",
          "value": "1"
        }
      ],
      "id": 205,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "product_label"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Front Label Type",
      "attribute_id": 207,
      "options": [
        {
          "label": "Please Select Option",
          "value": "0"
        }
      ],
      "id": 207,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "front_label_image_name"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Fragrance",
      "attribute_id": 208,
      "id": 208,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "fragrance"
    }
  ],
  "short_description": "<ul>\n<li>Medium Firmness</li>\n<li>Hand Tufted</li>\n<li>Turnable</li>\n<li>Choice Of Colours</li>\n<li>Storage Options</li>\n</ul>",
  "description": "<p>The Cavali divan bed is a smart, modern divan with both a comfortable mattress and an attractive looking base. The mattress of this bed is a traditional sprung mattress finished in a quilted damask fabric. The mattress is hand tufted, making the fillings densely packed and adding extra durability to your mattress.</p>\n<p>The base of the Cavali divan is available in a choice of modern chenille fabrics, giving you great flexibility if you need the bed to fit into a particular colour scheme. You can also add storage options to the base if you could benefit from the extra space in keeping your bedroom neat and tidy.</p>\n<p>The bed photographed is upholstered in Wool Steel fabric with our <span style=\"text-decoration: underline;\"><a href=\"https://bedfactorydirect.co.uk/coniston-22-chenille-headboard\">Coniston headboard</a></span>. Don't forget to add the headboard to your basket to complete the look of your new Divan.</p>",
  "tsk": 1643504456,
  "option_group": [
    "chenille_fabrics",
    "faux_leather_fabrics",
    "faux_suede_fabrics",
    "crushed_velvet_fabrics",
    "luxury_velvet_fabrics",
    "premium_fabrics"
  ],
  "regular_price": 299,
  "final_price": 259,
  "product_links": [
    {
      "link_type": "crosssell",
      "linked_product_sku": "MP2MattressProtector",
      "linked_product_type": "configurable",
      "position": 1,
      "sku": "cavali-divan-bed"
    },
    {
      "link_type": "crosssell",
      "linked_product_sku": "Luxury Hotel Duvet Cover And Pillowcases",
      "linked_product_type": "simple",
      "position": 2,
      "sku": "cavali-divan-bed"
    },
    {
      "link_type": "crosssell",
      "linked_product_sku": "Bed Factory Essential Pillows",
      "linked_product_type": "simple",
      "position": 3,
      "sku": "cavali-divan-bed"
    },
    {
      "link_type": "crosssell",
      "linked_product_sku": "Tranquil Pillow",
      "linked_product_type": "simple",
      "position": 4,
      "sku": "cavali-divan-bed"
    },
    {
      "link_type": "crosssell",
      "linked_product_sku": "Divan Bed Removal",
      "linked_product_type": "simple",
      "position": 5,
      "sku": "cavali-divan-bed"
    },
    {
      "link_type": "crosssell",
      "linked_product_sku": "Divan Bed Assembly",
      "linked_product_type": "simple",
      "position": 6,
      "sku": "cavali-divan-bed"
    }
  ],
  "url_path": "cavali-divan-bed",
  "type_id": "configurable",
  "media_gallery": [
    {
      "image": "/2/-/2-drawers-side_20.jpg",
      "pos": 2,
      "typ": "image",
      "lab": "cavali divan bed"
    },
    {
      "image": "/c/a/cavali_grey.jpg",
      "pos": 2,
      "typ": "image",
      "lab": "cavali divan bed"
    },
    {
      "image": "/c/h/chrome-feet_20.jpg",
      "pos": 3,
      "typ": "image",
      "lab": "cavali divan bed"
    }
  ],
  "tax_class_id": 2,
  "delivery_cms_block": "standard_frame_delivery",
  "url_key": "cavali-divan-bed",
  "cust_pro_canonical": "100",
  "shipping_group": 1,
  "special_price": 259,
  "custom_options": [
    {
      "image_size_x": "0",
      "image_size_y": "0",
      "max_characters": "0",
      "price": 0,
      "values": [
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 0,
          "option_type_id": "17409",
          "logo": "",
          "price_type": "fixed",
          "sku": "3ft",
          "title": "Single",
          "sort_order": 0,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 120,
          "option_type_id": "17410",
          "logo": "",
          "price_type": "fixed",
          "sku": "4ft",
          "title": "Small Double",
          "sort_order": 1,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 120,
          "option_type_id": "17411",
          "logo": "",
          "price_type": "fixed",
          "sku": "4ft6",
          "title": "Double",
          "sort_order": 2,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 170,
          "option_type_id": "17412",
          "logo": "",
          "price_type": "fixed",
          "sku": "5ft",
          "title": "King",
          "sort_order": 3,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 240,
          "option_type_id": "17413",
          "logo": "",
          "price_type": "fixed",
          "sku": "6ft",
          "title": "Super King",
          "sort_order": 4,
          "layer": null
        }
      ],
      "price_type": null,
      "option_id": 13,
      "iscolor": "0",
      "is_require": true,
      "type": "select",
      "title": "Size",
      "sort_order": 1
    },
    {
      "image_size_x": "0",
      "image_size_y": "0",
      "max_characters": "0",
      "price": 0,
      "values": [
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 0,
          "option_type_id": "17414",
          "logo": "",
          "price_type": "fixed",
          "sku": "standard",
          "title": "No Storage",
          "sort_order": 0,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 60,
          "option_type_id": "17415",
          "logo": "",
          "price_type": "fixed",
          "sku": "2drs",
          "title": "2 Drawers Side",
          "sort_order": 1,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 60,
          "option_type_id": "17416",
          "logo": "",
          "price_type": "fixed",
          "sku": "2dre",
          "title": "2 Drawers End",
          "sort_order": 2,
          "layer": null
        },
        {
          "image": "",
          "colour": "0",
          "quantity": "",
          "price": 100,
          "option_type_id": "17417",
          "logo": "",
          "price_type": "fixed",
          "sku": "4dr",
          "title": "4 Drawers",
          "sort_order": 3,
          "layer": null
        }
      ],
      "price_type": null,
      "option_id": 14,
      "iscolor": "",
      "is_require": true,
      "type": "select",
      "title": "Storage",
      "sort_order": 2
    },
    {
      "image_size_x": "0",
      "image_size_y": "0",
      "max_characters": "0",
      "price": 0,
      "values": [
        {
          "image": "",
          "colour": "Purple",
          "quantity": "",
          "price": 10,
          "option_type_id": "168776",
          "logo": "",
          "price_type": "fixed",
          "sku": "aubchen",
          "title": "Aubergine Chenille",
          "sort_order": 1,
          "layer": "/../../productreview/tmp/image/aubergine-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Black ",
          "quantity": "",
          "price": 0,
          "option_type_id": "168777",
          "logo": "",
          "price_type": "fixed",
          "sku": "blkchen",
          "title": "Black Chenille",
          "sort_order": 2,
          "layer": "/../../productreview/tmp/image/black-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168778",
          "logo": "",
          "price_type": "fixed",
          "sku": "brnchen",
          "title": "Brown Chenille",
          "sort_order": 3,
          "layer": "/../../productreview/tmp/image/brown-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Charcoal",
          "quantity": "",
          "price": 0,
          "option_type_id": "168779",
          "logo": "",
          "price_type": "fixed",
          "sku": "charchen",
          "title": "Charcoal Chenille",
          "sort_order": 4,
          "layer": "/../../productreview/tmp/image/charocal-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168780",
          "logo": "",
          "price_type": "fixed",
          "sku": "grychen",
          "title": "Grey Chenille",
          "sort_order": 5,
          "layer": "/../../productreview/tmp/image/grey-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Cream",
          "quantity": "",
          "price": 0,
          "option_type_id": "168781",
          "logo": "",
          "price_type": "fixed",
          "sku": "natchen",
          "title": "Natural Chenille",
          "sort_order": 6,
          "layer": "/../../productreview/tmp/image/natural-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Purple",
          "quantity": "",
          "price": 0,
          "option_type_id": "168782",
          "logo": "",
          "price_type": "fixed",
          "sku": "purchen",
          "title": "Purple Chenille",
          "sort_order": 7,
          "layer": "/../../productreview/tmp/image/purple-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Sand",
          "quantity": "",
          "price": 0,
          "option_type_id": "168783",
          "logo": "",
          "price_type": "fixed",
          "sku": "sanchen",
          "title": "Sand Chenille",
          "sort_order": 8,
          "layer": "/../../productreview/tmp/image/sand-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Cream",
          "quantity": "",
          "price": 0,
          "option_type_id": "168784",
          "logo": "",
          "price_type": "fixed",
          "sku": "stochen",
          "title": "Stone Chenille",
          "sort_order": 9,
          "layer": "/../../productreview/tmp/image/stone-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Teal",
          "quantity": "",
          "price": 0,
          "option_type_id": "168785",
          "logo": "",
          "price_type": "fixed",
          "sku": "techen",
          "title": "Teal Chenille",
          "sort_order": 10,
          "layer": "/../../productreview/tmp/image/teal-chenille.jpg"
        },
        {
          "image": "",
          "colour": "Black",
          "quantity": "",
          "price": 0,
          "option_type_id": "168786",
          "logo": "",
          "price_type": "fixed",
          "sku": "blkfaux",
          "title": "Black Faux Leather",
          "sort_order": 11,
          "layer": "/../../productreview/tmp/image/black-faux-leather.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168787",
          "logo": "",
          "price_type": "fixed",
          "sku": "brnfaux",
          "title": "Brown Faux Leather",
          "sort_order": 12,
          "layer": "/../../productreview/tmp/image/brown-faux-leather.jpg"
        },
        {
          "image": "",
          "colour": "Cream",
          "quantity": "",
          "price": 0,
          "option_type_id": "168788",
          "logo": "",
          "price_type": "fixed",
          "sku": "crmfaux",
          "title": "Cream Faux Leather",
          "sort_order": 13,
          "layer": "/../../productreview/tmp/image/cream-faux-leather.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168789",
          "logo": "",
          "price_type": "fixed",
          "sku": "gryfaux",
          "title": "Grey Faux Leather",
          "sort_order": 14,
          "layer": "/../../productreview/tmp/image/grey-faux-leather.jpg"
        },
        {
          "image": "",
          "colour": "White",
          "quantity": "",
          "price": 0,
          "option_type_id": "168790",
          "logo": "",
          "price_type": "fixed",
          "sku": "whtfaux",
          "title": "White Faux Leather",
          "sort_order": 15,
          "layer": "/../../productreview/tmp/image/white-faux-leather.jpg"
        },
        {
          "image": "",
          "colour": "Black",
          "quantity": "",
          "price": 0,
          "option_type_id": "168791",
          "logo": "",
          "price_type": "fixed",
          "sku": "blkfauxs",
          "title": "Black Faux Suede",
          "sort_order": 16,
          "layer": "/../../productreview/tmp/image/black-suede.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168792",
          "logo": "",
          "price_type": "fixed",
          "sku": "brnfauxs",
          "title": "Brown Faux Suede",
          "sort_order": 17,
          "layer": "/../../productreview/tmp/image/brown-suede.jpg"
        },
        {
          "image": "",
          "colour": "Cream",
          "quantity": "",
          "price": 0,
          "option_type_id": "168793",
          "logo": "",
          "price_type": "fixed",
          "sku": "crmfaux",
          "title": "Cream Faux Suede",
          "sort_order": 18,
          "layer": "/../../productreview/tmp/image/cream-suede.jpg"
        },
        {
          "image": "",
          "colour": "Ivory",
          "quantity": "",
          "price": 0,
          "option_type_id": "168794",
          "logo": "",
          "price_type": "fixed",
          "sku": "cshvi",
          "title": "Crushed Velvet Ivory",
          "sort_order": 19,
          "layer": "/../../productreview/tmp/image/crushed-velvet-ivory.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168795",
          "logo": "",
          "price_type": "fixed",
          "sku": "cshvs",
          "title": "Crushed Velvet Steel",
          "sort_order": 20,
          "layer": "/../../productreview/tmp/image/crushed-velvet-steel.jpg"
        },
        {
          "image": "",
          "colour": "Black",
          "quantity": "",
          "price": 0,
          "option_type_id": "168796",
          "logo": "",
          "price_type": "fixed",
          "sku": "blkluxv",
          "title": "Black Luxury Velvet",
          "sort_order": 21,
          "layer": "/../../productreview/tmp/image/luxury-velvet-ebony.jpg"
        },
        {
          "image": "",
          "colour": "Blue",
          "quantity": "",
          "price": 0,
          "option_type_id": "168797",
          "logo": "",
          "price_type": "fixed",
          "sku": "mluxv",
          "title": "Marine Luxury Velvet",
          "sort_order": 22,
          "layer": "/../../productreview/tmp/image/luxury-velvet-marine.jpg"
        },
        {
          "image": "",
          "colour": "Mink",
          "quantity": "",
          "price": 0,
          "option_type_id": "168798",
          "logo": "",
          "price_type": "fixed",
          "sku": "minluxv",
          "title": "Mink Luxury Velvet",
          "sort_order": 23,
          "layer": "/../../productreview/tmp/image/luxury-velvet-mink.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168799",
          "logo": "",
          "price_type": "fixed",
          "sku": "pluxv",
          "title": "Pebble Luxury Velvet",
          "sort_order": 24,
          "layer": "/../../productreview/tmp/image/luxury-velvet-pebble.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168800",
          "logo": "",
          "price_type": "fixed",
          "sku": "stluxv",
          "title": "Steel Luxury Velvet",
          "sort_order": 25,
          "layer": "/../../productreview/tmp/image/luxury-velvet-steel.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168801",
          "logo": "",
          "price_type": "fixed",
          "sku": "arrantruf",
          "title": "Arrran Truffle",
          "sort_order": 26,
          "layer": "/../../productreview/tmp/image/Arran-truffle.jpg"
        },
        {
          "image": "",
          "colour": "Blue",
          "quantity": "",
          "price": 0,
          "option_type_id": "168802",
          "logo": "",
          "price_type": "fixed",
          "sku": "atalntic",
          "title": "Atlantic",
          "sort_order": 27,
          "layer": "/../../productreview/tmp/image/atlantic.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168803",
          "logo": "",
          "price_type": "fixed",
          "sku": "bertruf",
          "title": "Berwick Truffle",
          "sort_order": 28,
          "layer": "/../../productreview/tmp/image/berwick-truffle.jpg"
        },
        {
          "image": "",
          "colour": "Cream",
          "quantity": "",
          "price": 0,
          "option_type_id": "168804",
          "logo": "",
          "price_type": "fixed",
          "sku": "brackbe",
          "title": "Bracken Beige",
          "sort_order": 29,
          "layer": "/../../productreview/tmp/image/bracken-beige.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168805",
          "logo": "",
          "price_type": "fixed",
          "sku": "brackchar",
          "title": "Bracken Charcoal",
          "sort_order": 30,
          "layer": "/../../productreview/tmp/image/bracken-charcoal.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168806",
          "logo": "",
          "price_type": "fixed",
          "sku": "conc",
          "title": "Concrete ",
          "sort_order": 31,
          "layer": "/../../productreview/tmp/image/concrete.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168807",
          "logo": "",
          "price_type": "fixed",
          "sku": "countb",
          "title": "Country Beige",
          "sort_order": 32,
          "layer": "/../../productreview/tmp/image/country-beige.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168808",
          "logo": "",
          "price_type": "fixed",
          "sku": "gracegra",
          "title": "Graceland Graphite",
          "sort_order": 34,
          "layer": "/../../productreview/tmp/image/graceland-graphite.jpg"
        },
        {
          "image": "",
          "colour": "Pink",
          "quantity": "",
          "price": 0,
          "option_type_id": "168809",
          "logo": "",
          "price_type": "fixed",
          "sku": "gracepnk",
          "title": "Graceland Pink",
          "sort_order": 35,
          "layer": "/../../productreview/tmp/image/graceland-ping.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168810",
          "logo": "",
          "price_type": "fixed",
          "sku": "gracesil",
          "title": "Graceland SIlver",
          "sort_order": 36,
          "layer": "/../../productreview/tmp/image/graceland-silver_1.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168811",
          "logo": "",
          "price_type": "fixed",
          "sku": "hessian",
          "title": "Hessian Fabric",
          "sort_order": 38,
          "layer": "/../../productreview/tmp/image/hessian.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168812",
          "logo": "",
          "price_type": "fixed",
          "sku": "jeffc",
          "title": "Jeff Clay",
          "sort_order": 39,
          "layer": "/../../productreview/tmp/image/jeff-clay.jpg"
        },
        {
          "image": "",
          "colour": "Gey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168813",
          "logo": "",
          "price_type": "fixed",
          "sku": "linslt",
          "title": "Linette Slate",
          "sort_order": 40,
          "layer": "/../../productreview/tmp/image/linetta-slate.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168814",
          "logo": "",
          "price_type": "fixed",
          "sku": "quarry",
          "title": "Quarry",
          "sort_order": 41,
          "layer": "/../../productreview/tmp/image/quarry.jpg"
        },
        {
          "image": "",
          "colour": "Brown",
          "quantity": "",
          "price": 0,
          "option_type_id": "168815",
          "logo": "",
          "price_type": "fixed",
          "sku": "wooll",
          "title": "Wool Latte",
          "sort_order": 42,
          "layer": "/../../productreview/tmp/image/wool-latte.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168816",
          "logo": "",
          "price_type": "fixed",
          "sku": "wools",
          "title": "Wool Steel",
          "sort_order": 43,
          "layer": "/../../productreview/tmp/image/wool-steel.jpg"
        },
        {
          "image": "",
          "colour": "Grey",
          "quantity": "",
          "price": 0,
          "option_type_id": "168817",
          "logo": "",
          "price_type": "fixed",
          "sku": "mercury",
          "title": "Mercury",
          "sort_order": 44,
          "layer": "/../../productreview/tmp/image/mercury.jpg"
        }
      ],
      "price_type": null,
      "option_id": 6604,
      "iscolor": "1",
      "is_require": true,
      "type": "select",
      "title": "Fabrics",
      "sort_order": 10
    }
  ],
  "total_reviews": 48,
  "category": [
    {
      "category_id": 3,
      "name": "Beds",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 13,
      "name": "Divan Beds",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 77,
      "name": "Open Coil Divans",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 51,
      "name": "Bed Factory Direct",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 100,
      "name": "Divan Beds Sale",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 119,
      "name": "Black Friday Divan Beds",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 121,
      "name": "Black Friday Deals",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 124,
      "name": "Cyber Week Divan Beds",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 92,
      "name": "Snooze Zone",
      "is_blacklisted": 0,
      "position": 1
    }
  ],
  "isStock": 0,
  "mattress_type": [
    220
  ],
  "original_price": 299,
  "original_price_tax": 0,
  "original_price_incl_tax": 299,
  "originalPrice": 299,
  "originalPriceTax": 0,
  "originalPriceInclTax": 299,
  "original_special_price": 259,
  "original_final_price": 259,
  "price_tax": 0,
  "price_incl_tax": 259,
  "priceTax": 0,
  "priceInclTax": 259,
  "special_price_tax": 0,
  "special_price_incl_tax": 0,
  "specialPrice": 259,
  "specialPriceTax": 0,
  "specialPriceInclTax": 0,
  "final_price_tax": 0,
  "final_price_incl_tax": 259,
  "finalPrice": 259,
  "finalPriceTax": 0,
  "finalPriceInclTax": 259,
  "_score": 36.72348,
  "qty": 1,
  "errors": {
    "custom_options": null,
    "custom_options_customOption_13": null,
    "custom_options_customOption_14": null,
    "custom_options_customOption_6604": null
  },
  "info": {},
  "parentSku": "cavali-divan-bed",
  "parentId": 452,
  "product_option": {
    "extension_attributes": {
      "custom_options": {
        "13": {
          "option_id": 13,
          "option_value": "17410"
        },
        "14": {
          "option_id": 14,
          "option_value": "17415"
        },
        "6604": {
          "option_id": 6604,
          "option_value": "168798"
        }
      },
      "configurable_item_options": [],
      "bundle_options": []
    }
  }
}
             const diffLog = this.$store.dispatch('cart/addItem', {
        productToAdd: testProduct
      });
      console.log('789456 Product adding to cart');
      diffLog.clientNotifications.forEach(notificationData => {
        console.log('789456 Successfully added', notificationData);
        // this.notifyUser(notificationData)
      });
          })
          .catch(error => {
            console.log("36521 Error occured while getting data for product : ",product.name,"Error is ", error);
          });
      })
      let product = {
        id: '452',
        attribute_set_id: '4',
        type_id: 'simple',
        sku: 'cavali-divan-bed',
        has_options: '1',
        required_options: '1',
        created_at: '2020-05-06 12:30:13',
        updated_at: '2022-01-14 06:42:06',
        status: '1',
        visibility: '4',
        stock: {
          is_in_stock: true,
          qty: 10000000
        },
        tax_class_id: '2',
        product_type_1: '25',
        brand: '34',
        shipping_group: '1',
        isFabric: '1',
        isFabrics: '0',
        swatches_sample_product: '0',
        total_reviews: '48',
        average_score: '4',
        isStock: '0',
        product_label: '1',
        fragrance: '309',
        description:
          '<p>The Cavali divan bed is a smart, modern divan with both a comfortable mattress and an attractive looking base. The mattress of this bed is a traditional sprung mattress finished in a quilted damask fabric. The mattress is hand tufted, making the fillings densely packed and adding extra durability to your mattress.</p>\n<p>The base of the Cavali divan is available in a choice of modern chenille fabrics, giving you great flexibility if you need the bed to fit into a particular colour scheme. You can also add storage options to the base if you could benefit from the extra space in keeping your bedroom neat and tidy.</p>\n<p>The bed photographed is upholstered in Wool Steel fabric with our <span style="text-decoration: underline;"><a href="https://bedfactorydirect.co.uk/coniston-22-chenille-headboard">Coniston headboard</a></span>. Don\'t forget to add the headboard to your basket to complete the look of your new Divan.</p>',
        short_description:
          '<ul>\n<li>Medium Firmness</li>\n<li>Hand Tufted</li>\n<li>Turnable</li>\n<li>Choice Of Colours</li>\n<li>Storage Options</li>\n</ul>',
        meta_keyword: 'Sleepover Divan Bed',
        specs:
          '<p><strong>Divan Size</strong></p>\n<ul>\n<li>Single - (3\'0" x 6\'3") / (90 x 190cm)</li>\n<li>Small Double - (4\'0" x 6\'3") / (120 x 190cm)</li>\n<li>Double - (4\'6" x 6\'3") / (135 x 190cm)</li>\n<li>King - (5\'0" x 6\'6") / (150 x 200cm)</li>\n<li>Super King - (6\'0" x 6\'6") / (180 x 200cm)</li>\n</ul>\n<p><strong>Mattress Depth</strong></p>\n<ul>\n<li>10" / 25cm</li>\n</ul>\n<p><strong>Base Depth</strong></p>\n<ul>\n<li>15.5" / 39cm (Including Feet)</li>\n</ul>\n<p><strong>Drawer Dimensions </strong></p>\n<ul>\n<li>Height - 9" / 23cm</li>\n<li>Width - 29" / 74cm</li>\n<li>Depth - 20.5" / 52cm</li>\n<li>Internal Storage - 7" / 18cm</li>\n</ul>\n<p><strong>Storage Options</strong></p>\n<p><img src="https://admin.bedfactorydirect.co.uk/pub/media/storage-options-guide.jpg" alt="storage options guide" width="100%" /></p>\n<p style="font-size: 12px;">* All measurements are approximate and are subject to a tolerance of + or - 2cm</p>',
        shipping_grouptext: '3',
        option_group:
          'chenille_fabrics,faux_leather_fabrics,faux_suede_fabrics,crushed_velvet_fabrics,luxury_velvet_fabrics,premium_fabrics',
        name: 'Cavali Divan Bed',
        meta_title: 'Cavali Divan Bed',
        meta_description:
          'The Amazing Cavali divan bed has a deep hand tufted turnable mattress, full of luxury and support. Available in a rainbow of colours, this bed also has the option to add storage drawers if you need extra storage space.',
        image: '/c/a/cavali_grey.jpg',
        small_image: '/c/a/cavali_grey.jpg',
        thumbnail: '/c/a/cavali_grey.jpg',
        options_container: 'container2',
        image_label: 'cavali divan bed',
        small_image_label: 'cavali divan bed',
        thumbnail_label: 'cavali divan bed',
        country_of_manufacture: 'GB',
        msrp_display_actual_price_type: '0',
        url_key: 'cavali-divan-bed',
        slug: 'cavali-divan-bed',
        gift_message_available: '2',
        swatch_image: '/c/a/cavali_grey.jpg',
        manufacturing_parts: '28,29',
        cust_pro_canonical: '100',
        filter_size: '194,195,196,197,198',
        comfort_grade: '205',
        delivery_cms_block: 'standard_frame_delivery',
        mattress_type: '220',
        front_label_image_name: '0',
        price: '299.000000',
        special_price: '259.000000',
        weight: '10.000000',
        special_from_date: '2020-04-06 00:00:00',
        options: [{}, {}, {}],
        media_gallery: {
          images: {
            '201': {
              value_id: '201',
              file: '/c/a/cavali_grey.jpg',
              media_type: 'image',
              entity_id: '452',
              label: 'cavali divan bed',
              position: '2',
              disabled: '0',
              label_default: 'cavali divan bed',
              position_default: '2',
              disabled_default: '0',
              video_provider: null,
              video_url: null,
              video_title: null,
              video_description: null,
              video_metadata: null,
              video_provider_default: null,
              video_url_default: null,
              video_title_default: null,
              video_description_default: null,
              video_metadata_default: null
            },
            '3306': {
              value_id: '3306',
              file: '/2/-/2-drawers-side_20.jpg',
              media_type: 'image',
              entity_id: '452',
              label: 'cavali divan bed',
              position: '2',
              disabled: '0',
              label_default: 'cavali divan bed',
              position_default: '2',
              disabled_default: '0',
              video_provider: null,
              video_url: null,
              video_title: null,
              video_description: null,
              video_metadata: null,
              video_provider_default: null,
              video_url_default: null,
              video_title_default: null,
              video_description_default: null,
              video_metadata_default: null
            },
            '3307': {
              value_id: '3307',
              file: '/c/h/chrome-feet_20.jpg',
              media_type: 'image',
              entity_id: '452',
              label: 'cavali divan bed',
              position: '3',
              disabled: '0',
              label_default: 'cavali divan bed',
              position_default: '3',
              disabled_default: '0',
              video_provider: null,
              video_url: null,
              video_title: null,
              video_description: null,
              video_metadata: null,
              video_provider_default: null,
              video_url_default: null,
              video_title_default: null,
              video_description_default: null,
              video_metadata_default: null
            }
          },
          values: []
        },
        extension_attributes: {},
        tier_price: [],
        tier_price_changed: 0,
        category_ids: ['3', '13', '77', '51', '100', '119', '121', '124', '92'],
        is_salable: 1,
        product_option: {
          extension_attributes: {
            custom_options: {
              '6604': {
                option_id: 6604,
                option_value: 168776
              },
              '6605': {
                '6604': {
                  option_id: 6604,
                  option_value: 168776
                }
              }
            },
            configurable_item_options: [],
            bundle_options: []
          }
        }
      };
      let originalProduct = {
        average_score: 4,
        gift_message_available: true,
        front_label_image_name: '0',
        specs:
          '<p><strong>Divan Size</strong></p>\n<ul>\n<li>Single - (3\'0" x 6\'3") / (90 x 190cm)</li>\n<li>Small Double - (4\'0" x 6\'3") / (120 x 190cm)</li>\n<li>Double - (4\'6" x 6\'3") / (135 x 190cm)</li>\n<li>King - (5\'0" x 6\'6") / (150 x 200cm)</li>\n<li>Super King - (6\'0" x 6\'6") / (180 x 200cm)</li>\n</ul>\n<p><strong>Mattress Depth</strong></p>\n<ul>\n<li>10" / 25cm</li>\n</ul>\n<p><strong>Base Depth</strong></p>\n<ul>\n<li>15.5" / 39cm (Including Feet)</li>\n</ul>\n<p><strong>Drawer Dimensions </strong></p>\n<ul>\n<li>Height - 9" / 23cm</li>\n<li>Width - 29" / 74cm</li>\n<li>Depth - 20.5" / 52cm</li>\n<li>Internal Storage - 7" / 18cm</li>\n</ul>\n<p><strong>Storage Options</strong></p>\n<p><img src="https://admin.bedfactorydirect.co.uk/pub/media/storage-options-guide.jpg" alt="storage options guide" width="100%" /></p>\n<p style="font-size: 12px;">* All measurements are approximate and are subject to a tolerance of + or - 2cm</p>',
        product_label: 1,
        price: 259,
        special_from_date: '2020-04-06 00:00:00',
        id: 452,
        category_ids: [3, 13, 77, 51, 100, 119, 121, 124, 92],
        sku: 'cavali-divan-bed',
        filter_size: [194, 195, 196, 197, 198],
        stock: {
          is_in_stock: true,
          max_sale_qty: 10000,
          stock_status: 1,
          min_sale_qty: 1,
          item_id: 528,
          backorders: false,
          min_qty: 0,
          product_id: 452,
          qty: 10000000,
          is_qty_decimal: false,
          low_stock_date: null
        },
        brand: 34,
        slug: 'cavali-divan-bed',
        image: '/c/a/cavali_grey.jpg',
        thumbnail: '/c/a/cavali_grey.jpg',
        manufacturing_parts: [28, 29],
        swatches_sample_product: 0,
        visibility: 4,
        meta_title: 'Cavali Divan Bed',
        isFabrics: 0,
        weight: 10,
        isFabric: 1,
        product_type_1: 25,
        meta_description:
          'The Amazing Cavali divan bed has a deep hand tufted turnable mattress, full of luxury and support. Available in a rainbow of colours, this bed also has the option to add storage drawers if you need extra storage space.',
        country_of_manufacture: 'GB',
        comfort_grade: [205],
        meta_keyword: 'Sleepover Divan Bed',
        name: 'Cavali Divan Bed',
        shipping_grouptext: '3',
        status: 1,
        attributes_metadata: [
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Product Name',
            attribute_id: 73,
            id: 73,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'name'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'SKU',
            attribute_id: 74,
            id: 74,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: true,
            attribute_code: 'sku'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Description',
            attribute_id: 75,
            id: 75,
            entity_type_id: 4,
            frontend_input: 'textarea',
            is_user_defined: false,
            is_comparable: true,
            attribute_code: 'description'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Short Description',
            attribute_id: 76,
            id: 76,
            entity_type_id: 4,
            frontend_input: 'textarea',
            is_user_defined: false,
            is_comparable: true,
            attribute_code: 'short_description'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Price',
            attribute_id: 77,
            id: 77,
            entity_type_id: 4,
            frontend_input: 'price',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'price'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Special Price',
            attribute_id: 78,
            id: 78,
            entity_type_id: 4,
            frontend_input: 'price',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'special_price'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Special Price From Date',
            attribute_id: 79,
            id: 79,
            entity_type_id: 4,
            frontend_input: 'date',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'special_from_date'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Special Price To Date',
            attribute_id: 80,
            id: 80,
            entity_type_id: 4,
            frontend_input: 'date',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'special_to_date'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Cost',
            attribute_id: 81,
            id: 81,
            entity_type_id: 4,
            frontend_input: 'price',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'cost'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Weight',
            attribute_id: 82,
            id: 82,
            entity_type_id: 4,
            frontend_input: 'weight',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'weight'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Manufacturer',
            attribute_id: 83,
            id: 83,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: true,
            attribute_code: 'manufacturer'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Meta Title',
            attribute_id: 84,
            id: 84,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'meta_title'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Meta Keywords',
            attribute_id: 85,
            id: 85,
            entity_type_id: 4,
            frontend_input: 'textarea',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'meta_keyword'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Meta Description',
            attribute_id: 86,
            id: 86,
            entity_type_id: 4,
            frontend_input: 'textarea',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'meta_description'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Base',
            attribute_id: 87,
            id: 87,
            entity_type_id: 4,
            frontend_input: 'media_image',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'image'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Small',
            attribute_id: 88,
            id: 88,
            entity_type_id: 4,
            frontend_input: 'media_image',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'small_image'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Thumbnail',
            attribute_id: 89,
            id: 89,
            entity_type_id: 4,
            frontend_input: 'media_image',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'thumbnail'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Media Gallery',
            attribute_id: 90,
            id: 90,
            entity_type_id: 4,
            frontend_input: 'gallery',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'media_gallery'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Tier Price',
            attribute_id: 92,
            id: 92,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'tier_price'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Color',
            attribute_id: 93,
            id: 93,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: true,
            attribute_code: 'color'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Set Product as New from Date',
            attribute_id: 94,
            id: 94,
            entity_type_id: 4,
            frontend_input: 'date',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'news_from_date'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Set Product as New to Date',
            attribute_id: 95,
            id: 95,
            entity_type_id: 4,
            frontend_input: 'date',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'news_to_date'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Image Gallery',
            attribute_id: 96,
            id: 96,
            entity_type_id: 4,
            frontend_input: 'gallery',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'gallery'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Enable Product',
            attribute_id: 97,
            options: [
              {
                label: 'Enabled',
                value: '1'
              }
            ],
            id: 97,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'status'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Visibility',
            attribute_id: 99,
            options: [
              {
                label: 'Catalog, Search',
                value: '4'
              }
            ],
            id: 99,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'visibility'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'New Theme',
            attribute_id: 100,
            options: [
              {
                label: '-- Please Select --',
                value: ''
              }
            ],
            id: 100,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'custom_design'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Active From',
            attribute_id: 101,
            id: 101,
            entity_type_id: 4,
            frontend_input: 'date',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'custom_design_from'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Active To',
            attribute_id: 102,
            id: 102,
            entity_type_id: 4,
            frontend_input: 'date',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'custom_design_to'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Layout',
            attribute_id: 104,
            options: [
              {
                label: 'No layout updates',
                value: ''
              }
            ],
            id: 104,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'page_layout'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Categories',
            attribute_id: 105,
            id: 105,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'category_ids'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Display Product Options In',
            attribute_id: 106,
            id: 106,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'options_container'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Country of Manufacture',
            attribute_id: 114,
            options: [
              {
                label: 'United Kingdom',
                value: 'GB'
              }
            ],
            id: 114,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'country_of_manufacture'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Quantity',
            attribute_id: 115,
            id: 115,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'quantity_and_stock_status'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'New Layout',
            attribute_id: 116,
            options: [
              {
                label: 'No layout updates',
                value: ''
              }
            ],
            id: 116,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'custom_layout'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Minimum Advertised Price',
            attribute_id: 117,
            id: 117,
            entity_type_id: 4,
            frontend_input: 'price',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'msrp'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Display Actual Price',
            attribute_id: 118,
            options: [
              {
                label: 'Use config',
                value: '0'
              }
            ],
            id: 118,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'msrp_display_actual_price_type'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'URL Key',
            attribute_id: 121,
            id: 121,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'url_key'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Dynamic Price',
            attribute_id: 127,
            id: 127,
            entity_type_id: 4,
            frontend_input: 'boolean',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'price_type'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Dynamic SKU',
            attribute_id: 128,
            id: 128,
            entity_type_id: 4,
            frontend_input: 'boolean',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'sku_type'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Dynamic Weight',
            attribute_id: 129,
            id: 129,
            entity_type_id: 4,
            frontend_input: 'boolean',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'weight_type'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Price View',
            attribute_id: 130,
            id: 130,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'price_view'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Ship Bundle Items',
            attribute_id: 131,
            id: 131,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'shipment_type'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Allow Gift Message',
            attribute_id: 132,
            options: [
              {
                label: 'Yes',
                value: '1'
              }
            ],
            id: 132,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'gift_message_available'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Swatch',
            attribute_id: 133,
            id: 133,
            entity_type_id: 4,
            frontend_input: 'media_image',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'swatch_image'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Tax Class',
            attribute_id: 134,
            options: [
              {
                label: 'Taxable Goods',
                value: '2'
              }
            ],
            id: 134,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'tax_class_id'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'product type',
            attribute_id: 145,
            options: [
              {
                label: 'bfd',
                value: '25',
                sort_order: 1
              }
            ],
            id: 145,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'product_type_1'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'manufacturing parts',
            attribute_id: 146,
            options: [
              {
                label: 'base',
                value: '28',
                sort_order: 2
              },
              {
                label: 'mattress',
                value: '29',
                sort_order: 3
              }
            ],
            id: 146,
            entity_type_id: 4,
            frontend_input: 'multiselect',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'manufacturing_parts'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Brand',
            attribute_id: 149,
            options: [
              {
                label: 'Bed Factory',
                value: '34',
                sort_order: 1
              }
            ],
            id: 149,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'brand'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Size',
            attribute_id: 152,
            id: 152,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'size'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Colour',
            attribute_id: 153,
            id: 153,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'colour'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Custom Product Canonical URL',
            attribute_id: 159,
            id: 159,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'cust_pro_canonical'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'specs',
            attribute_id: 165,
            id: 165,
            entity_type_id: 4,
            frontend_input: 'textarea',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'specs'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Storage Drawers',
            attribute_id: 166,
            id: 166,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'storage_drawers'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Shipping Group',
            attribute_id: 167,
            options: [
              {
                label: '2 Man Delivery',
                value: '1'
              }
            ],
            id: 167,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'shipping_group'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Shipping Group lead days',
            attribute_id: 168,
            id: 168,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'shipping_grouptext'
          },
          {
            is_visible_on_front: true,
            is_visible: true,
            default_frontend_label: 'Is Fabric',
            attribute_id: 169,
            options: [
              {
                label: 'Yes',
                value: '1'
              }
            ],
            id: 169,
            entity_type_id: 4,
            frontend_input: 'boolean',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'isFabric'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Sample Atrribute',
            attribute_id: 170,
            id: 170,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'sample_attribute'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Fabric Type',
            attribute_id: 171,
            options: [
              {
                label: 'Chenille',
                value: '0'
              }
            ],
            id: 171,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'isFabrics'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Filter Size',
            attribute_id: 173,
            options: [
              {
                label: 'Single',
                value: '194',
                sort_order: 1
              },
              {
                label: 'Small Double',
                value: '195',
                sort_order: 2
              },
              {
                label: 'Double',
                value: '196',
                sort_order: 3
              },
              {
                label: 'King',
                value: '197',
                sort_order: 4
              },
              {
                label: 'Super King',
                value: '198',
                sort_order: 5
              }
            ],
            id: 173,
            entity_type_id: 4,
            frontend_input: 'multiselect',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'filter_size'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Comfort Grade',
            attribute_id: 174,
            options: [
              {
                label: '3-Medium',
                value: '205',
                sort_order: 3
              }
            ],
            id: 174,
            entity_type_id: 4,
            frontend_input: 'multiselect',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'comfort_grade'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Swatches Sample Product',
            attribute_id: 177,
            options: [
              {
                label: 'No',
                value: '0'
              }
            ],
            id: 177,
            entity_type_id: 4,
            frontend_input: 'boolean',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'swatches_sample_product'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Option Group',
            attribute_id: 179,
            options: [
              {
                label: 'Chenille Fabrics',
                value: 'chenille_fabrics'
              },
              {
                label: 'Faux Leather Fabrics',
                value: 'faux_leather_fabrics'
              },
              {
                label: 'Faux Suede Fabrics',
                value: 'faux_suede_fabrics'
              },
              {
                label: 'Crushed Velvet Fabrics',
                value: 'crushed_velvet_fabrics'
              },
              {
                label: 'Luxury Velvet Fabrics',
                value: 'luxury_velvet_fabrics'
              },
              {
                label: 'Premium Fabrics',
                value: 'premium_fabrics'
              }
            ],
            id: 179,
            entity_type_id: 4,
            frontend_input: 'multiselect',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'option_group'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Delivery Tab CMS Block',
            attribute_id: 180,
            options: [
              {
                label: 'Delivery - Standard Bed Frame',
                value: 'standard_frame_delivery'
              }
            ],
            id: 180,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'delivery_cms_block'
          },
          {
            is_visible_on_front: true,
            is_visible: true,
            default_frontend_label: 'Mattress Type',
            attribute_id: 182,
            options: [
              {
                label: 'Open Coil',
                value: '220',
                sort_order: 2
              }
            ],
            id: 182,
            entity_type_id: 4,
            frontend_input: 'multiselect',
            is_user_defined: true,
            is_comparable: true,
            attribute_code: 'mattress_type'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Configuration',
            attribute_id: 185,
            id: 185,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: true,
            attribute_code: 'product_configuration'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Furniture Range',
            attribute_id: 186,
            id: 186,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'furniture_range'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Ottoman Lift',
            attribute_id: 187,
            id: 187,
            entity_type_id: 4,
            frontend_input: 'multiselect',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'ottoman_lift'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Custom Layout Update',
            attribute_id: 188,
            id: 188,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'custom_layout_update_file'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Imegamedia Finance Filter',
            attribute_id: 200,
            id: 200,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'imegamedia_finance_filter'
          },
          {
            is_visible_on_front: true,
            is_visible: true,
            default_frontend_label: 'Total Reviews',
            attribute_id: 201,
            id: 201,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'total_reviews'
          },
          {
            is_visible_on_front: true,
            is_visible: true,
            default_frontend_label: 'Average Score',
            attribute_id: 202,
            id: 202,
            entity_type_id: 4,
            frontend_input: 'text',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'average_score'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Stock Check',
            attribute_id: 203,
            options: [
              {
                label: 'No',
                value: '0'
              }
            ],
            id: 203,
            entity_type_id: 4,
            frontend_input: 'boolean',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'isStock'
          },
          {
            is_visible_on_front: true,
            is_visible: true,
            default_frontend_label: 'Guarantee',
            attribute_id: 204,
            id: 204,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: true,
            attribute_code: 'guarantee'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Product Label',
            attribute_id: 205,
            options: [
              {
                label: 'Yes',
                value: '1'
              }
            ],
            id: 205,
            entity_type_id: 4,
            frontend_input: 'boolean',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'product_label'
          },
          {
            is_visible_on_front: true,
            is_visible: true,
            default_frontend_label: 'Front Label Type',
            attribute_id: 207,
            options: [
              {
                label: 'Please Select Option',
                value: '0'
              }
            ],
            id: 207,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: false,
            is_comparable: false,
            attribute_code: 'front_label_image_name'
          },
          {
            is_visible_on_front: false,
            is_visible: true,
            default_frontend_label: 'Fragrance',
            attribute_id: 208,
            id: 208,
            entity_type_id: 4,
            frontend_input: 'select',
            is_user_defined: true,
            is_comparable: false,
            attribute_code: 'fragrance'
          }
        ],
        short_description:
          '<ul>\n<li>Medium Firmness</li>\n<li>Hand Tufted</li>\n<li>Turnable</li>\n<li>Choice Of Colours</li>\n<li>Storage Options</li>\n</ul>',
        description:
          '<p>The Cavali divan bed is a smart, modern divan with both a comfortable mattress and an attractive looking base. The mattress of this bed is a traditional sprung mattress finished in a quilted damask fabric. The mattress is hand tufted, making the fillings densely packed and adding extra durability to your mattress.</p>\n<p>The base of the Cavali divan is available in a choice of modern chenille fabrics, giving you great flexibility if you need the bed to fit into a particular colour scheme. You can also add storage options to the base if you could benefit from the extra space in keeping your bedroom neat and tidy.</p>\n<p>The bed photographed is upholstered in Wool Steel fabric with our <span style="text-decoration: underline;"><a href="https://bedfactorydirect.co.uk/coniston-22-chenille-headboard">Coniston headboard</a></span>. Don\'t forget to add the headboard to your basket to complete the look of your new Divan.</p>',
        tsk: 1642142751,
        option_group: [
          'chenille_fabrics',
          'faux_leather_fabrics',
          'faux_suede_fabrics',
          'crushed_velvet_fabrics',
          'luxury_velvet_fabrics',
          'premium_fabrics'
        ],
        regular_price: 299,
        final_price: 259,
        product_links: [
          {
            link_type: 'crosssell',
            linked_product_sku: 'MP2MattressProtector',
            linked_product_type: 'configurable',
            position: 1,
            sku: 'cavali-divan-bed'
          },
          {
            link_type: 'crosssell',
            linked_product_sku: 'Luxury Hotel Duvet Cover And Pillowcases',
            linked_product_type: 'simple',
            position: 2,
            sku: 'cavali-divan-bed'
          },
          {
            link_type: 'crosssell',
            linked_product_sku: 'Bed Factory Essential Pillows',
            linked_product_type: 'simple',
            position: 3,
            sku: 'cavali-divan-bed'
          },
          {
            link_type: 'crosssell',
            linked_product_sku: 'Tranquil Pillow',
            linked_product_type: 'simple',
            position: 4,
            sku: 'cavali-divan-bed'
          },
          {
            link_type: 'crosssell',
            linked_product_sku: 'Divan Bed Removal',
            linked_product_type: 'simple',
            position: 5,
            sku: 'cavali-divan-bed'
          },
          {
            link_type: 'crosssell',
            linked_product_sku: 'Divan Bed Assembly',
            linked_product_type: 'simple',
            position: 6,
            sku: 'cavali-divan-bed'
          }
        ],
        url_path: 'cavali-divan-bed',
        type_id: 'configurable',
        media_gallery: [
          {
            image: '/2/-/2-drawers-side_20.jpg',
            pos: 2,
            typ: 'image',
            lab: 'cavali divan bed'
          },
          {
            image: '/c/a/cavali_grey.jpg',
            pos: 2,
            typ: 'image',
            lab: 'cavali divan bed'
          },
          {
            image: '/c/h/chrome-feet_20.jpg',
            pos: 3,
            typ: 'image',
            lab: 'cavali divan bed'
          }
        ],
        tax_class_id: 2,
        delivery_cms_block: 'standard_frame_delivery',
        url_key: 'cavali-divan-bed',
        cust_pro_canonical: '100',
        shipping_group: 1,
        special_price: 259,
        custom_options: [
          {
            image_size_x: '0',
            image_size_y: '0',
            max_characters: '0',
            price: 0,
            values: [
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 0,
                option_type_id: '17409',
                logo: '',
                price_type: 'fixed',
                sku: '3ft',
                title: 'Single',
                sort_order: 0,
                layer: null
              },
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 120,
                option_type_id: '17410',
                logo: '',
                price_type: 'fixed',
                sku: '4ft',
                title: 'Small Double',
                sort_order: 1,
                layer: null
              },
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 120,
                option_type_id: '17411',
                logo: '',
                price_type: 'fixed',
                sku: '4ft6',
                title: 'Double',
                sort_order: 2,
                layer: null
              },
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 170,
                option_type_id: '17412',
                logo: '',
                price_type: 'fixed',
                sku: '5ft',
                title: 'King',
                sort_order: 3,
                layer: null
              },
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 240,
                option_type_id: '17413',
                logo: '',
                price_type: 'fixed',
                sku: '6ft',
                title: 'Super King',
                sort_order: 4,
                layer: null
              }
            ],
            price_type: null,
            option_id: 13,
            iscolor: '0',
            is_require: true,
            type: 'select',
            title: 'Size',
            sort_order: 1
          },
          {
            image_size_x: '0',
            image_size_y: '0',
            max_characters: '0',
            price: 0,
            values: [
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 0,
                option_type_id: '17414',
                logo: '',
                price_type: 'fixed',
                sku: 'standard',
                title: 'No Storage',
                sort_order: 0,
                layer: null
              },
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 60,
                option_type_id: '17415',
                logo: '',
                price_type: 'fixed',
                sku: '2drs',
                title: '2 Drawers Side',
                sort_order: 1,
                layer: null
              },
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 60,
                option_type_id: '17416',
                logo: '',
                price_type: 'fixed',
                sku: '2dre',
                title: '2 Drawers End',
                sort_order: 2,
                layer: null
              },
              {
                image: '',
                colour: '0',
                quantity: '',
                price: 100,
                option_type_id: '17417',
                logo: '',
                price_type: 'fixed',
                sku: '4dr',
                title: '4 Drawers',
                sort_order: 3,
                layer: null
              }
            ],
            price_type: null,
            option_id: 14,
            iscolor: '',
            is_require: true,
            type: 'select',
            title: 'Storage',
            sort_order: 2
          },
          {
            image_size_x: '0',
            image_size_y: '0',
            max_characters: '0',
            price: 0,
            values: [
              {
                image: '',
                colour: 'Purple',
                quantity: '',
                price: 10,
                option_type_id: '168776',
                logo: '',
                price_type: 'fixed',
                sku: 'aubchen',
                title: 'Aubergine Chenille',
                sort_order: 1,
                layer: '/../../productreview/tmp/image/aubergine-chenille.jpg'
              },
              {
                image: '',
                colour: 'Black ',
                quantity: '',
                price: 0,
                option_type_id: '168777',
                logo: '',
                price_type: 'fixed',
                sku: 'blkchen',
                title: 'Black Chenille',
                sort_order: 2,
                layer: '/../../productreview/tmp/image/black-chenille.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168778',
                logo: '',
                price_type: 'fixed',
                sku: 'brnchen',
                title: 'Brown Chenille',
                sort_order: 3,
                layer: '/../../productreview/tmp/image/brown-chenille.jpg'
              },
              {
                image: '',
                colour: 'Charcoal',
                quantity: '',
                price: 0,
                option_type_id: '168779',
                logo: '',
                price_type: 'fixed',
                sku: 'charchen',
                title: 'Charcoal Chenille',
                sort_order: 4,
                layer: '/../../productreview/tmp/image/charocal-chenille.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168780',
                logo: '',
                price_type: 'fixed',
                sku: 'grychen',
                title: 'Grey Chenille',
                sort_order: 5,
                layer: '/../../productreview/tmp/image/grey-chenille.jpg'
              },
              {
                image: '',
                colour: 'Cream',
                quantity: '',
                price: 0,
                option_type_id: '168781',
                logo: '',
                price_type: 'fixed',
                sku: 'natchen',
                title: 'Natural Chenille',
                sort_order: 6,
                layer: '/../../productreview/tmp/image/natural-chenille.jpg'
              },
              {
                image: '',
                colour: 'Purple',
                quantity: '',
                price: 0,
                option_type_id: '168782',
                logo: '',
                price_type: 'fixed',
                sku: 'purchen',
                title: 'Purple Chenille',
                sort_order: 7,
                layer: '/../../productreview/tmp/image/purple-chenille.jpg'
              },
              {
                image: '',
                colour: 'Sand',
                quantity: '',
                price: 0,
                option_type_id: '168783',
                logo: '',
                price_type: 'fixed',
                sku: 'sanchen',
                title: 'Sand Chenille',
                sort_order: 8,
                layer: '/../../productreview/tmp/image/sand-chenille.jpg'
              },
              {
                image: '',
                colour: 'Cream',
                quantity: '',
                price: 0,
                option_type_id: '168784',
                logo: '',
                price_type: 'fixed',
                sku: 'stochen',
                title: 'Stone Chenille',
                sort_order: 9,
                layer: '/../../productreview/tmp/image/stone-chenille.jpg'
              },
              {
                image: '',
                colour: 'Teal',
                quantity: '',
                price: 0,
                option_type_id: '168785',
                logo: '',
                price_type: 'fixed',
                sku: 'techen',
                title: 'Teal Chenille',
                sort_order: 10,
                layer: '/../../productreview/tmp/image/teal-chenille.jpg'
              },
              {
                image: '',
                colour: 'Black',
                quantity: '',
                price: 0,
                option_type_id: '168786',
                logo: '',
                price_type: 'fixed',
                sku: 'blkfaux',
                title: 'Black Faux Leather',
                sort_order: 11,
                layer: '/../../productreview/tmp/image/black-faux-leather.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168787',
                logo: '',
                price_type: 'fixed',
                sku: 'brnfaux',
                title: 'Brown Faux Leather',
                sort_order: 12,
                layer: '/../../productreview/tmp/image/brown-faux-leather.jpg'
              },
              {
                image: '',
                colour: 'Cream',
                quantity: '',
                price: 0,
                option_type_id: '168788',
                logo: '',
                price_type: 'fixed',
                sku: 'crmfaux',
                title: 'Cream Faux Leather',
                sort_order: 13,
                layer: '/../../productreview/tmp/image/cream-faux-leather.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168789',
                logo: '',
                price_type: 'fixed',
                sku: 'gryfaux',
                title: 'Grey Faux Leather',
                sort_order: 14,
                layer: '/../../productreview/tmp/image/grey-faux-leather.jpg'
              },
              {
                image: '',
                colour: 'White',
                quantity: '',
                price: 0,
                option_type_id: '168790',
                logo: '',
                price_type: 'fixed',
                sku: 'whtfaux',
                title: 'White Faux Leather',
                sort_order: 15,
                layer: '/../../productreview/tmp/image/white-faux-leather.jpg'
              },
              {
                image: '',
                colour: 'Black',
                quantity: '',
                price: 0,
                option_type_id: '168791',
                logo: '',
                price_type: 'fixed',
                sku: 'blkfauxs',
                title: 'Black Faux Suede',
                sort_order: 16,
                layer: '/../../productreview/tmp/image/black-suede.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168792',
                logo: '',
                price_type: 'fixed',
                sku: 'brnfauxs',
                title: 'Brown Faux Suede',
                sort_order: 17,
                layer: '/../../productreview/tmp/image/brown-suede.jpg'
              },
              {
                image: '',
                colour: 'Cream',
                quantity: '',
                price: 0,
                option_type_id: '168793',
                logo: '',
                price_type: 'fixed',
                sku: 'crmfaux',
                title: 'Cream Faux Suede',
                sort_order: 18,
                layer: '/../../productreview/tmp/image/cream-suede.jpg'
              },
              {
                image: '',
                colour: 'Ivory',
                quantity: '',
                price: 0,
                option_type_id: '168794',
                logo: '',
                price_type: 'fixed',
                sku: 'cshvi',
                title: 'Crushed Velvet Ivory',
                sort_order: 19,
                layer: '/../../productreview/tmp/image/crushed-velvet-ivory.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168795',
                logo: '',
                price_type: 'fixed',
                sku: 'cshvs',
                title: 'Crushed Velvet Steel',
                sort_order: 20,
                layer: '/../../productreview/tmp/image/crushed-velvet-steel.jpg'
              },
              {
                image: '',
                colour: 'Black',
                quantity: '',
                price: 0,
                option_type_id: '168796',
                logo: '',
                price_type: 'fixed',
                sku: 'blkluxv',
                title: 'Black Luxury Velvet',
                sort_order: 21,
                layer: '/../../productreview/tmp/image/luxury-velvet-ebony.jpg'
              },
              {
                image: '',
                colour: 'Blue',
                quantity: '',
                price: 0,
                option_type_id: '168797',
                logo: '',
                price_type: 'fixed',
                sku: 'mluxv',
                title: 'Marine Luxury Velvet',
                sort_order: 22,
                layer: '/../../productreview/tmp/image/luxury-velvet-marine.jpg'
              },
              {
                image: '',
                colour: 'Mink',
                quantity: '',
                price: 0,
                option_type_id: '168798',
                logo: '',
                price_type: 'fixed',
                sku: 'minluxv',
                title: 'Mink Luxury Velvet',
                sort_order: 23,
                layer: '/../../productreview/tmp/image/luxury-velvet-mink.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168799',
                logo: '',
                price_type: 'fixed',
                sku: 'pluxv',
                title: 'Pebble Luxury Velvet',
                sort_order: 24,
                layer: '/../../productreview/tmp/image/luxury-velvet-pebble.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168800',
                logo: '',
                price_type: 'fixed',
                sku: 'stluxv',
                title: 'Steel Luxury Velvet',
                sort_order: 25,
                layer: '/../../productreview/tmp/image/luxury-velvet-steel.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168801',
                logo: '',
                price_type: 'fixed',
                sku: 'arrantruf',
                title: 'Arrran Truffle',
                sort_order: 26,
                layer: '/../../productreview/tmp/image/Arran-truffle.jpg'
              },
              {
                image: '',
                colour: 'Blue',
                quantity: '',
                price: 0,
                option_type_id: '168802',
                logo: '',
                price_type: 'fixed',
                sku: 'atalntic',
                title: 'Atlantic',
                sort_order: 27,
                layer: '/../../productreview/tmp/image/atlantic.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168803',
                logo: '',
                price_type: 'fixed',
                sku: 'bertruf',
                title: 'Berwick Truffle',
                sort_order: 28,
                layer: '/../../productreview/tmp/image/berwick-truffle.jpg'
              },
              {
                image: '',
                colour: 'Cream',
                quantity: '',
                price: 0,
                option_type_id: '168804',
                logo: '',
                price_type: 'fixed',
                sku: 'brackbe',
                title: 'Bracken Beige',
                sort_order: 29,
                layer: '/../../productreview/tmp/image/bracken-beige.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168805',
                logo: '',
                price_type: 'fixed',
                sku: 'brackchar',
                title: 'Bracken Charcoal',
                sort_order: 30,
                layer: '/../../productreview/tmp/image/bracken-charcoal.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168806',
                logo: '',
                price_type: 'fixed',
                sku: 'conc',
                title: 'Concrete ',
                sort_order: 31,
                layer: '/../../productreview/tmp/image/concrete.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168807',
                logo: '',
                price_type: 'fixed',
                sku: 'countb',
                title: 'Country Beige',
                sort_order: 32,
                layer: '/../../productreview/tmp/image/country-beige.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168808',
                logo: '',
                price_type: 'fixed',
                sku: 'gracegra',
                title: 'Graceland Graphite',
                sort_order: 34,
                layer: '/../../productreview/tmp/image/graceland-graphite.jpg'
              },
              {
                image: '',
                colour: 'Pink',
                quantity: '',
                price: 0,
                option_type_id: '168809',
                logo: '',
                price_type: 'fixed',
                sku: 'gracepnk',
                title: 'Graceland Pink',
                sort_order: 35,
                layer: '/../../productreview/tmp/image/graceland-ping.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168810',
                logo: '',
                price_type: 'fixed',
                sku: 'gracesil',
                title: 'Graceland SIlver',
                sort_order: 36,
                layer: '/../../productreview/tmp/image/graceland-silver_1.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168811',
                logo: '',
                price_type: 'fixed',
                sku: 'hessian',
                title: 'Hessian Fabric',
                sort_order: 38,
                layer: '/../../productreview/tmp/image/hessian.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168812',
                logo: '',
                price_type: 'fixed',
                sku: 'jeffc',
                title: 'Jeff Clay',
                sort_order: 39,
                layer: '/../../productreview/tmp/image/jeff-clay.jpg'
              },
              {
                image: '',
                colour: 'Gey',
                quantity: '',
                price: 0,
                option_type_id: '168813',
                logo: '',
                price_type: 'fixed',
                sku: 'linslt',
                title: 'Linette Slate',
                sort_order: 40,
                layer: '/../../productreview/tmp/image/linetta-slate.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168814',
                logo: '',
                price_type: 'fixed',
                sku: 'quarry',
                title: 'Quarry',
                sort_order: 41,
                layer: '/../../productreview/tmp/image/quarry.jpg'
              },
              {
                image: '',
                colour: 'Brown',
                quantity: '',
                price: 0,
                option_type_id: '168815',
                logo: '',
                price_type: 'fixed',
                sku: 'wooll',
                title: 'Wool Latte',
                sort_order: 42,
                layer: '/../../productreview/tmp/image/wool-latte.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168816',
                logo: '',
                price_type: 'fixed',
                sku: 'wools',
                title: 'Wool Steel',
                sort_order: 43,
                layer: '/../../productreview/tmp/image/wool-steel.jpg'
              },
              {
                image: '',
                colour: 'Grey',
                quantity: '',
                price: 0,
                option_type_id: '168817',
                logo: '',
                price_type: 'fixed',
                sku: 'mercury',
                title: 'Mercury',
                sort_order: 44,
                layer: '/../../productreview/tmp/image/mercury.jpg'
              }
            ],
            price_type: null,
            option_id: 6604,
            iscolor: '1',
            is_require: true,
            type: 'select',
            title: 'Fabrics',
            sort_order: 10
          }
        ],
        total_reviews: 48,
        category: [
          {
            category_id: 3,
            name: 'Beds',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 13,
            name: 'Divan Beds',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 77,
            name: 'Open Coil Divans',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 51,
            name: 'Bed Factory Direct',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 100,
            name: 'Divan Beds Sale',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 119,
            name: 'Black Friday Divan Beds',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 121,
            name: 'Black Friday Deals',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 124,
            name: 'Cyber Week Divan Beds',
            is_blacklisted: 0,
            position: 999999
          },
          {
            category_id: 92,
            name: 'Snooze Zone',
            is_blacklisted: 0,
            position: 1
          }
        ],
        isStock: 0,
        mattress_type: [220],
        original_price: 299,
        original_price_tax: 0,
        original_price_incl_tax: 299,
        originalPrice: 299,
        originalPriceTax: 0,
        originalPriceInclTax: 299,
        original_special_price: 259,
        original_final_price: 259,
        price_tax: 0,
        price_incl_tax: 259,
        priceTax: 0,
        priceInclTax: 259,
        special_price_tax: 0,
        special_price_incl_tax: 0,
        specialPrice: 259,
        specialPriceTax: 0,
        specialPriceInclTax: 0,
        final_price_tax: 0,
        final_price_incl_tax: 259,
        finalPrice: 259,
        finalPriceTax: 0,
        finalPriceInclTax: 259,
        _score: 0,
        qty: 1,
        errors: {
          custom_options: null,
          custom_options_customOption_13: null,
          custom_options_customOption_14: null,
          custom_options_customOption_6604: null
        },
        info: {},
        parentSku: 'cavali-divan-bed',
        parentId: 452,
        product_option: {
          extension_attributes: {
            custom_options: {
              '13': {
                option_id: 13,
                option_value: '17411'
              },
              '14': {
                option_id: 14,
                option_value: '17416'
              },
              '6604': {
                option_id: 6604,
                option_value: '168790'
              }
            },
            configurable_item_options: [],
            bundle_options: []
          }
        }
      };
      let configurable = {
  "short_description": "<ul>\n<li>Wooden Bed</li>\n<li>Quick Delivery</li>\n<li>Flat Slats</li>\n<li>Central Support Leg</li>\n</ul>",
  "average_score": 4,
  "gift_message_available": false,
  "description": "<p>The Sedna bed frame by Limelight is a classic looking wooden bed with a modern finish. The simple design of the Sedna means it will fit into any style bedroom and will give a clean and fresh feel to your bedroom through it's natural wood design.</p>\n<p>The Sedna is available in all UK standard sizes with a next day delivery option if required.</p>",
  "configurable_options": [
    {
      "attribute_id": 152,
      "values": [
        {
          "value_index": "47",
          "label": "Single"
        },
        {
          "value_index": "48",
          "label": "Small Double"
        },
        {
          "value_index": "49",
          "label": "Double"
        },
        {
          "value_index": "52",
          "label": "King Size"
        }
      ],
      "label": "Size",
      "attribute_code": "size"
    }
  ],
  "tsk": 1642597743,
  "size_options": [
    47,
    48,
    49,
    52
  ],
  "specs": "<p><strong>Dimensions Single:</strong></p>\r\n<ul>\r\n<li>Length: 202cm</li>\r\n<li>Width: 98cm</li>\r\n<li>Headboard Height: 90cm</li>\r\n<li>Footboard Height: 65cm</li>\r\n<li>Underbed Clearance: 26cm</li>\r\n</ul>\r\n<p><strong>Dimensions Small Double:</strong></p>\r\n<ul>\r\n<li>Length: 202cm</li>\r\n<li>Width: 130cm</li>\r\n<li>Headboard Height: 90cm</li>\r\n<li>Footboard Height: 65cm</li>\r\n<li>Underbed Clearance: 26cm</li>\r\n</ul>\r\n<p><strong>Dimensions Double:</strong></p>\r\n<ul>\r\n<li>Length: 202cm</li>\r\n<li>Width: 133cm</li>\r\n<li>Headboard Height: 90cm</li>\r\n<li>Footboard Height: 65cm</li>\r\n<li>Underbed Clearance: 26cm</li>\r\n</ul>\r\n<p><strong>Dimensions King:</strong></p>\r\n<ul>\r\n<li>Length: 202cm</li>\r\n<li>Width: 159cm</li>\r\n<li>Headboard Height: 90cm</li>\r\n<li>Footboard Height: 65cm</li>\r\n<li>Underbed Clearance: 26cm</li>\r\n</ul>",
  "regular_price": 379,
  "product_label": 1,
  "final_price": 229,
  "price": 229,
  "id": 879,
  "category_ids": [
    3,
    16,
    57
  ],
  "sku": "S02",
  "filter_size": [
    194,
    195,
    196,
    198
  ],
  "stock": {
    "is_in_stock": true,
    "stock_status": 1,
    "min_qty": 0,
    "qty": 92,
    "use_config_notify_stock_qty": true,
    "notify_stock_qty": 1
  },
  "brand": 38,
  "slug": "limelight-sedna-bedstead",
  "url_path": "limelight-sedna-bedstead",
  "image": "/s/e/sedna_wide162.jpg",
  "thumbnail": "/s/e/sedna_wide162.jpg",
  "manufacturing_parts": [
    27
  ],
  "swatches_sample_product": 0,
  "visibility": 4,
  "meta_title": "Limelight Sedna Bedstead",
  "type_id": "configurable",
  "media_gallery": [
    {
      "image": "/s/e/sedna_wide162.jpg",
      "pos": 1,
      "typ": "image",
      "lab": "Sedna Wooden Bed"
    },
    {
      "image": "/l/i/limelight-sedna-wooden_front.jpg",
      "pos": 2,
      "typ": "image",
      "lab": "LimeLight-Sedna-Wooden Front"
    },
    {
      "image": "/l/i/limelight-sedna-wooden_headend.jpg",
      "pos": 3,
      "typ": "image",
      "lab": "LimeLight-Sedna-Wooden Headend"
    },
    {
      "image": "/l/i/limelight-sedna-wooden_footend.jpg",
      "pos": 4,
      "typ": "image",
      "lab": "LimeLight-Sedna-Wooden Footend"
    }
  ],
  "tax_class_id": 2,
  "weight": 10,
  "delivery_cms_block": "limelight_delivery",
  "isFabric": 0,
  "url_key": "limelight-sedna-bedstead",
  "cust_pro_canonical": "100",
  "product_type_1": 26,
  "meta_description": "The Limelight Sedna Bedstead made from solid wood is a simple slatted frame to suit any bedroom. Supplied through Bed Factory direct with free delivery. ",
  "country_of_manufacture": "GB",
  "shipping_group": 1,
  "special_price": 229,
  "meta_keyword": "Limelight; Sedna; Wooden; Bed Frame; Bed Factory Direct",
  "name": "Limelight Sedna Wooden Bed",
  "total_reviews": 5,
  "configurable_children": [
    {
      "short_description": "<ul>\r\n<li>Wooden Bed</li>\r\n<li>Quick Delivery</li>\r\n<li>Flat Slats</li>\r\n<li>Central Support Leg</li>\r\n</ul>",
      "gift_message_available": false,
      "description": "<p>The Sedna bed frame by Limelight is a classic looking wooden bed with a modern finish. The simple design of the Sedna means it will fit into any style bedroom and will give a clean and fresh feel to your bedroom through it's natural wood design.</p>\r\n<p>The Sedna is available in all UK standard sizes to fit your new or existing mattress.</p>",
      "regular_price": 329,
      "final_price": 179,
      "price": 179,
      "special_from_date": "2020-06-03 00:00:00",
      "id": 877,
      "sku": "S01",
      "filter_size": [
        194,
        195,
        196,
        198
      ],
      "stock": {
        "is_in_stock": true,
        "stock_status": 1,
        "min_qty": 0,
        "qty": 68,
        "use_config_notify_stock_qty": true,
        "notify_stock_qty": 1
      },
      "brand": 38,
      "manufacturing_parts": [
        27
      ],
      "swatches_sample_product": 0,
      "visibility": 1,
      "meta_title": "Limelight Sedna Bedstead",
      "tax_class_id": 2,
      "weight": 10,
      "delivery_cms_block": "limelight_delivery",
      "isFabric": 0,
      "cust_pro_canonical": "100",
      "product_type_1": 26,
      "meta_description": "The Limelight Sedna Bedstead made from solid wood is a simple slatted frame to suit any bedroom. Supplied through Bed Factory direct with free delivery. ",
      "country_of_manufacture": "GB",
      "size": 47,
      "shipping_group": 1,
      "special_price": 179,
      "meta_keyword": "Limelight; Sedna; Wooden; Bed Frame; Bed Factory Direct",
      "name": "Limelight Sedna Wooden Bed-Single",
      "shipping_grouptext": "5",
      "status": 1,
      "original_price": 329,
      "original_price_tax": 0,
      "original_price_incl_tax": 329,
      "originalPrice": 329,
      "originalPriceTax": 0,
      "originalPriceInclTax": 329,
      "original_special_price": 179,
      "original_final_price": 179,
      "price_tax": 0,
      "price_incl_tax": 179,
      "priceTax": 0,
      "priceInclTax": 179,
      "special_price_tax": 0,
      "special_price_incl_tax": 0,
      "specialPrice": 179,
      "specialPriceTax": 0,
      "specialPriceInclTax": 0,
      "final_price_tax": 0,
      "final_price_incl_tax": 179,
      "finalPrice": 179,
      "finalPriceTax": 0,
      "finalPriceInclTax": 179
    },
    {
      "short_description": "<ul>\n<li>Wooden Bed</li>\n<li>Quick Delivery</li>\n<li>Flat Slats</li>\n<li>Central Support Leg</li>\n</ul>",
      "gift_message_available": false,
      "description": "<p>The Sedna bed frame by Limelight is a classic looking wooden bed with a modern finish. The simple design of the Sedna means it will fit into any style bedroom and will give a clean and fresh feel to your bedroom through it's natural wood design.</p>\n<p>The Sedna is available in all UK standard sizes with a next day delivery option if required.</p>",
      "regular_price": 379,
      "final_price": 229,
      "price": 229,
      "special_from_date": "2020-06-03 00:00:00",
      "id": 878,
      "sku": "S05",
      "filter_size": [
        194,
        195,
        196,
        198
      ],
      "stock": {
        "is_in_stock": true,
        "stock_status": 1,
        "min_qty": 0,
        "qty": 136,
        "use_config_notify_stock_qty": true,
        "notify_stock_qty": 1
      },
      "brand": 38,
      "manufacturing_parts": [
        27
      ],
      "swatches_sample_product": 0,
      "visibility": 1,
      "meta_title": "Limelight Sedna Bedstead",
      "tax_class_id": 2,
      "weight": 10,
      "delivery_cms_block": "limelight_delivery",
      "isFabric": 0,
      "cust_pro_canonical": "100",
      "product_type_1": 26,
      "meta_description": "The Limelight Sedna Bedstead made from solid wood is a simple slatted frame to suit any bedroom. Supplied through Bed Factory direct with free delivery. ",
      "country_of_manufacture": "GB",
      "size": 48,
      "shipping_group": 1,
      "special_price": 229,
      "meta_keyword": "Limelight; Sedna; Wooden; Bed Frame; Bed Factory Direct",
      "name": "Limelight Sedna Wooden Bed-Small Double",
      "shipping_grouptext": "5",
      "status": 1,
      "original_price": 379,
      "original_price_tax": 0,
      "original_price_incl_tax": 379,
      "originalPrice": 379,
      "originalPriceTax": 0,
      "originalPriceInclTax": 379,
      "original_special_price": 229,
      "original_final_price": 229,
      "price_tax": 0,
      "price_incl_tax": 229,
      "priceTax": 0,
      "priceInclTax": 229,
      "special_price_tax": 0,
      "special_price_incl_tax": 0,
      "specialPrice": 229,
      "specialPriceTax": 0,
      "specialPriceInclTax": 0,
      "final_price_tax": 0,
      "final_price_incl_tax": 229,
      "finalPrice": 229,
      "finalPriceTax": 0,
      "finalPriceInclTax": 229
    },
    {
      "short_description": "<ul>\n<li>Wooden Bed</li>\n<li>Quick Delivery</li>\n<li>Flat Slats</li>\n<li>Central Support Leg</li>\n</ul>",
      "gift_message_available": false,
      "description": "<p>The Sedna bed frame by Limelight is a classic looking wooden bed with a modern finish. The simple design of the Sedna means it will fit into any style bedroom and will give a clean and fresh feel to your bedroom through it's natural wood design.</p>\n<p>The Sedna is available in all UK standard sizes with a next day delivery option if required.</p>",
      "regular_price": 379,
      "final_price": 229,
      "price": 229,
      "special_from_date": "2020-06-03 00:00:00",
      "id": 879,
      "sku": "S02",
      "filter_size": [
        194,
        195,
        196,
        198
      ],
      "stock": {
        "is_in_stock": true,
        "stock_status": 1,
        "min_qty": 0,
        "qty": 92,
        "use_config_notify_stock_qty": true,
        "notify_stock_qty": 1
      },
      "brand": 38,
      "manufacturing_parts": [
        27
      ],
      "swatches_sample_product": 0,
      "visibility": 1,
      "meta_title": "Limelight Sedna Bedstead",
      "tax_class_id": 2,
      "weight": 10,
      "delivery_cms_block": "limelight_delivery",
      "isFabric": 0,
      "cust_pro_canonical": "100",
      "product_type_1": 26,
      "meta_description": "The Limelight Sedna Bedstead made from solid wood is a simple slatted frame to suit any bedroom. Supplied through Bed Factory direct with free delivery. ",
      "country_of_manufacture": "GB",
      "size": 49,
      "shipping_group": 1,
      "special_price": 229,
      "meta_keyword": "Limelight; Sedna; Wooden; Bed Frame; Bed Factory Direct",
      "name": "Limelight Sedna Wooden Bed-Double",
      "shipping_grouptext": "0",
      "status": 1,
      "original_price": 379,
      "original_price_tax": 0,
      "original_price_incl_tax": 379,
      "originalPrice": 379,
      "originalPriceTax": 0,
      "originalPriceInclTax": 379,
      "original_special_price": 229,
      "original_final_price": 229,
      "price_tax": 0,
      "price_incl_tax": 229,
      "priceTax": 0,
      "priceInclTax": 229,
      "special_price_tax": 0,
      "special_price_incl_tax": 0,
      "specialPrice": 229,
      "specialPriceTax": 0,
      "specialPriceInclTax": 0,
      "final_price_tax": 0,
      "final_price_incl_tax": 229,
      "finalPrice": 229,
      "finalPriceTax": 0,
      "finalPriceInclTax": 229
    },
    {
      "short_description": "<ul>\n<li>Wooden Bed</li>\n<li>Quick Delivery</li>\n<li>Flat Slats</li>\n<li>Central Support Leg</li>\n</ul>",
      "gift_message_available": false,
      "description": "<p>The Sedna bed frame by Limelight is a classic looking wooden bed with a modern finish. The simple design of the Sedna means it will fit into any style bedroom and will give a clean and fresh feel to your bedroom through it's natural wood design.</p>\n<p>The Sedna is available in all UK standard sizes with a next day delivery option if required.</p>",
      "regular_price": 429,
      "final_price": 279,
      "price": 279,
      "special_from_date": "2020-06-03 00:00:00",
      "id": 880,
      "sku": "S03",
      "filter_size": [
        194,
        195,
        196,
        198
      ],
      "stock": {
        "is_in_stock": true,
        "stock_status": 1,
        "min_qty": 0,
        "qty": 41,
        "use_config_notify_stock_qty": true,
        "notify_stock_qty": 1
      },
      "brand": 38,
      "manufacturing_parts": [
        27
      ],
      "swatches_sample_product": 0,
      "visibility": 1,
      "meta_title": "Limelight Sedna Bedstead",
      "tax_class_id": 2,
      "weight": 10,
      "delivery_cms_block": "limelight_delivery",
      "isFabric": 0,
      "cust_pro_canonical": "100",
      "product_type_1": 26,
      "meta_description": "The Limelight Sedna Bedstead made from solid wood is a simple slatted frame to suit any bedroom. Supplied through Bed Factory direct with free delivery. ",
      "country_of_manufacture": "GB",
      "size": 52,
      "shipping_group": 1,
      "special_price": 279,
      "meta_keyword": "Limelight; Sedna; Wooden; Bed Frame; Bed Factory Direct",
      "name": "Limelight Sedna Wooden Bed-King Size",
      "shipping_grouptext": "5",
      "status": 1,
      "original_price": 429,
      "original_price_tax": 0,
      "original_price_incl_tax": 429,
      "originalPrice": 429,
      "originalPriceTax": 0,
      "originalPriceInclTax": 429,
      "original_special_price": 279,
      "original_final_price": 279,
      "price_tax": 0,
      "price_incl_tax": 279,
      "priceTax": 0,
      "priceInclTax": 279,
      "special_price_tax": 0,
      "special_price_incl_tax": 0,
      "specialPrice": 279,
      "specialPriceTax": 0,
      "specialPriceInclTax": 0,
      "final_price_tax": 0,
      "final_price_incl_tax": 279,
      "finalPrice": 279,
      "finalPriceTax": 0,
      "finalPriceInclTax": 279
    }
  ],
  "category": [
    {
      "category_id": 3,
      "name": "Beds",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 16,
      "name": "Wooden Bed Frames",
      "is_blacklisted": 0,
      "position": 999999
    },
    {
      "category_id": 57,
      "name": "Limelight",
      "is_blacklisted": 0,
      "position": 999999
    }
  ],
  "shipping_grouptext": "0",
  "status": 1,
  "attributes_metadata": [
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Product Name",
      "attribute_id": 73,
      "id": 73,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "name"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "SKU",
      "attribute_id": 74,
      "id": 74,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": true,
      "attribute_code": "sku"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Description",
      "attribute_id": 75,
      "id": 75,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": true,
      "attribute_code": "description"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Short Description",
      "attribute_id": 76,
      "id": 76,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": true,
      "attribute_code": "short_description"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Price",
      "attribute_id": 77,
      "id": 77,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "price"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Special Price",
      "attribute_id": 78,
      "id": 78,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "special_price"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Special Price From Date",
      "attribute_id": 79,
      "id": 79,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "special_from_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Special Price To Date",
      "attribute_id": 80,
      "id": 80,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "special_to_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Cost",
      "attribute_id": 81,
      "id": 81,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "cost"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Weight",
      "attribute_id": 82,
      "id": 82,
      "entity_type_id": 4,
      "frontend_input": "weight",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "weight"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Manufacturer",
      "attribute_id": 83,
      "id": 83,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "manufacturer"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Meta Title",
      "attribute_id": 84,
      "id": 84,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "meta_title"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Meta Keywords",
      "attribute_id": 85,
      "id": 85,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "meta_keyword"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Meta Description",
      "attribute_id": 86,
      "id": 86,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "meta_description"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Base",
      "attribute_id": 87,
      "id": 87,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "image"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Small",
      "attribute_id": 88,
      "id": 88,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "small_image"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Thumbnail",
      "attribute_id": 89,
      "id": 89,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "thumbnail"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Media Gallery",
      "attribute_id": 90,
      "id": 90,
      "entity_type_id": 4,
      "frontend_input": "gallery",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "media_gallery"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Tier Price",
      "attribute_id": 92,
      "id": 92,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "tier_price"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Color",
      "attribute_id": 93,
      "id": 93,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "color"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Set Product as New from Date",
      "attribute_id": 94,
      "id": 94,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "news_from_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Set Product as New to Date",
      "attribute_id": 95,
      "id": 95,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "news_to_date"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Image Gallery",
      "attribute_id": 96,
      "id": 96,
      "entity_type_id": 4,
      "frontend_input": "gallery",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "gallery"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Enable Product",
      "attribute_id": 97,
      "options": [
        {
          "label": "Enabled",
          "value": "1"
        }
      ],
      "id": 97,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "status"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Visibility",
      "attribute_id": 99,
      "options": [
        {
          "label": "Not Visible Individually",
          "value": "1"
        },
        {
          "label": "Catalog, Search",
          "value": "4"
        }
      ],
      "id": 99,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "visibility"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "New Theme",
      "attribute_id": 100,
      "options": [
        {
          "label": "-- Please Select --",
          "value": ""
        }
      ],
      "id": 100,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_design"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Active From",
      "attribute_id": 101,
      "id": 101,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_design_from"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Active To",
      "attribute_id": 102,
      "id": 102,
      "entity_type_id": 4,
      "frontend_input": "date",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_design_to"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Layout",
      "attribute_id": 104,
      "options": [
        {
          "label": "No layout updates",
          "value": ""
        }
      ],
      "id": 104,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "page_layout"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Categories",
      "attribute_id": 105,
      "id": 105,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "category_ids"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Display Product Options In",
      "attribute_id": 106,
      "id": 106,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "options_container"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Country of Manufacture",
      "attribute_id": 114,
      "options": [
        {
          "label": "United Kingdom",
          "value": "GB"
        }
      ],
      "id": 114,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "country_of_manufacture"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Quantity",
      "attribute_id": 115,
      "id": 115,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "quantity_and_stock_status"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "New Layout",
      "attribute_id": 116,
      "options": [
        {
          "label": "No layout updates",
          "value": ""
        }
      ],
      "id": 116,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_layout"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Minimum Advertised Price",
      "attribute_id": 117,
      "id": 117,
      "entity_type_id": 4,
      "frontend_input": "price",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "msrp"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Display Actual Price",
      "attribute_id": 118,
      "options": [
        {
          "label": "Use config",
          "value": "0"
        }
      ],
      "id": 118,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "msrp_display_actual_price_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "URL Key",
      "attribute_id": 121,
      "id": 121,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "url_key"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Dynamic Price",
      "attribute_id": 127,
      "id": 127,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "price_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Dynamic SKU",
      "attribute_id": 128,
      "id": 128,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "sku_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Dynamic Weight",
      "attribute_id": 129,
      "id": 129,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "weight_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Price View",
      "attribute_id": 130,
      "id": 130,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "price_view"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Ship Bundle Items",
      "attribute_id": 131,
      "id": 131,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "shipment_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Allow Gift Message",
      "attribute_id": 132,
      "options": [
        {
          "label": "No",
          "value": "0"
        }
      ],
      "id": 132,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "gift_message_available"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Swatch",
      "attribute_id": 133,
      "id": 133,
      "entity_type_id": 4,
      "frontend_input": "media_image",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "swatch_image"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Tax Class",
      "attribute_id": 134,
      "options": [
        {
          "label": "Taxable Goods",
          "value": "2"
        }
      ],
      "id": 134,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "tax_class_id"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "product type",
      "attribute_id": 145,
      "options": [
        {
          "label": "non bfd",
          "value": "26",
          "sort_order": 2
        }
      ],
      "id": 145,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "product_type_1"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "manufacturing parts",
      "attribute_id": 146,
      "options": [
        {
          "label": "none",
          "value": "27",
          "sort_order": 1
        }
      ],
      "id": 146,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "manufacturing_parts"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Brand",
      "attribute_id": 149,
      "options": [
        {
          "label": "Limelight",
          "value": "38",
          "sort_order": 5
        }
      ],
      "id": 149,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "brand"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Size",
      "attribute_id": 152,
      "options": [
        {
          "label": "Single",
          "value": "47",
          "sort_order": 1
        },
        {
          "label": "Small Double",
          "value": "48",
          "sort_order": 2
        },
        {
          "label": "Double",
          "value": "49",
          "sort_order": 3
        },
        {
          "label": "King Size",
          "value": "52",
          "sort_order": 4
        }
      ],
      "id": 152,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "size"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Colour",
      "attribute_id": 153,
      "id": 153,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "colour"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Custom Product Canonical URL",
      "attribute_id": 159,
      "id": 159,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "cust_pro_canonical"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "specs",
      "attribute_id": 165,
      "id": 165,
      "entity_type_id": 4,
      "frontend_input": "textarea",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "specs"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Storage Drawers",
      "attribute_id": 166,
      "id": 166,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "storage_drawers"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Shipping Group",
      "attribute_id": 167,
      "options": [
        {
          "label": "2 Man Delivery",
          "value": "1"
        }
      ],
      "id": 167,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "shipping_group"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Shipping Group lead days",
      "attribute_id": 168,
      "id": 168,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "shipping_grouptext"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Is Fabric",
      "attribute_id": 169,
      "options": [
        {
          "label": "No",
          "value": "0"
        }
      ],
      "id": 169,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "isFabric"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Sample Atrribute",
      "attribute_id": 170,
      "id": 170,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "sample_attribute"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Fabric Type",
      "attribute_id": 171,
      "options": [
        {
          "label": "Please Select Option",
          "value": ""
        }
      ],
      "id": 171,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "isFabrics"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Filter Size",
      "attribute_id": 173,
      "options": [
        {
          "label": "Single",
          "value": "194",
          "sort_order": 1
        },
        {
          "label": "Small Double",
          "value": "195",
          "sort_order": 2
        },
        {
          "label": "Double",
          "value": "196",
          "sort_order": 3
        },
        {
          "label": "Super King",
          "value": "198",
          "sort_order": 5
        },
        {
          "label": "King",
          "value": "197",
          "sort_order": 4
        }
      ],
      "id": 173,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "filter_size"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Comfort Grade",
      "attribute_id": 174,
      "id": 174,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "comfort_grade"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Swatches Sample Product",
      "attribute_id": 177,
      "options": [
        {
          "label": "No",
          "value": "0"
        }
      ],
      "id": 177,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "swatches_sample_product"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Option Group",
      "attribute_id": 179,
      "id": 179,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "option_group"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Delivery Tab CMS Block",
      "attribute_id": 180,
      "options": [
        {
          "label": "Delivery - Limelight",
          "value": "limelight_delivery"
        }
      ],
      "id": 180,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "delivery_cms_block"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Mattress Type",
      "attribute_id": 182,
      "id": 182,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "mattress_type"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Configuration",
      "attribute_id": 185,
      "id": 185,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "product_configuration"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Furniture Range",
      "attribute_id": 186,
      "id": 186,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "furniture_range"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Ottoman Lift",
      "attribute_id": 187,
      "id": 187,
      "entity_type_id": 4,
      "frontend_input": "multiselect",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "ottoman_lift"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Custom Layout Update",
      "attribute_id": 188,
      "id": 188,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "custom_layout_update_file"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Imegamedia Finance Filter",
      "attribute_id": 200,
      "id": 200,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "imegamedia_finance_filter"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Total Reviews",
      "attribute_id": 201,
      "id": 201,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "total_reviews"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Average Score",
      "attribute_id": 202,
      "id": 202,
      "entity_type_id": 4,
      "frontend_input": "text",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "average_score"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Stock Check",
      "attribute_id": 203,
      "options": [
        {
          "label": "No",
          "value": "0"
        }
      ],
      "id": 203,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "isStock"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Guarantee",
      "attribute_id": 204,
      "id": 204,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": true,
      "attribute_code": "guarantee"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Product Label",
      "attribute_id": 205,
      "options": [
        {
          "label": "Yes",
          "value": "1"
        }
      ],
      "id": 205,
      "entity_type_id": 4,
      "frontend_input": "boolean",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "product_label"
    },
    {
      "is_visible_on_front": true,
      "is_visible": true,
      "default_frontend_label": "Front Label Type",
      "attribute_id": 207,
      "id": 207,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": false,
      "is_comparable": false,
      "attribute_code": "front_label_image_name"
    },
    {
      "is_visible_on_front": false,
      "is_visible": true,
      "default_frontend_label": "Fragrance",
      "attribute_id": 208,
      "id": 208,
      "entity_type_id": 4,
      "frontend_input": "select",
      "is_user_defined": true,
      "is_comparable": false,
      "attribute_code": "fragrance"
    }
  ],
  "isStock": 0,
  "original_price": 379,
  "original_price_tax": 0,
  "original_price_incl_tax": 379,
  "originalPrice": 379,
  "originalPriceTax": 0,
  "originalPriceInclTax": 379,
  "original_special_price": 229,
  "original_final_price": 229,
  "price_tax": 0,
  "price_incl_tax": 229,
  "priceTax": 0,
  "priceInclTax": 229,
  "special_price_tax": 0,
  "special_price_incl_tax": 0,
  "specialPrice": 229,
  "specialPriceTax": 0,
  "specialPriceInclTax": 0,
  "final_price_tax": 0,
  "final_price_incl_tax": 229,
  "finalPrice": 229,
  "finalPriceTax": 0,
  "finalPriceInclTax": 229,
  "_score": 27.680676,
  "qty": 1,
  "errors": {},
  "info": {},
  "parentSku": "Limelight Sedna Wooden Bed",
  "parentId": 815,
  "product_option": {
    "extension_attributes": {
      "custom_options": [],
      "configurable_item_options": [
        {
          "option_id": "152",
          "option_value": "49"
        }
      ],
      "bundle_options": []
    }
  },
  "options": [
    {
      "label": "Size",
      "value": "Double"
    }
  ],
  "is_configured": true,
  "special_from_date": "2020-06-03 00:00:00",
  "size": 49
}
      // const diffLog = await this.$store.dispatch('cart/addItem', {
      //   productToAdd: configurable
      // });
      // console.log('789456 Product adding to cart');
      // diffLog.clientNotifications.forEach(notificationData => {
      //   console.log('789456 Successfully added', notificationData);
      //   // this.notifyUser(notificationData)
      // });
      this.$bus.$emit('notification-progress-stop');
    },
    async addQuoteOriginal (quoteId) {
      console.log("785214 Here to add qoute to cart",quoteId);
      await this.$store.dispatch('cart/clear', { disconnect: false });
      await this.$store
        .dispatch('quotesystem/quoteSystemAddtoCart', {
          ref_quoteId: quoteId,
          current_quoteId: this.getCartToken
        })
        .then(resp => {
          console.log('785214 addtocartResponse', resp);
          this.$router.push(this.localizedRoute('/my-account/'));
        })
        .catch(err => {
          console.log('err occured from api call', err);
        });
      await this.$store.dispatch('cart/syncTotals', { forceServerSync: true });
      await this.$store.dispatch('cart/sync', {
        forceClientState: false,
        forceSync: true
      });
      this.$forceUpdate();
      this.$bus.$emit('notification-progress-stop');
      this.$router.push(this.localizedRoute('/cart'));
      await this.$store.dispatch('cart/sync', {
        forceClientState: false,
        forceSync: true
      });
      await this.$store.dispatch('cart/syncTotals', { forceServerSync: true });
      console.log('789652365 about to send to cart page');
      this.$router.push(this.localizedRoute('/cart'));
    },
    async quoteAddToCart (quoteId,index) {
      const quoteItemData = await CartService.getItems();
      if (
        !quoteItemData ||
        !quoteItemData.result ||
        quoteItemData.result.length <= 0
      ) {
        this.$bus.$emit('notification-progress-start', 'Processing ... ');
        this.addQuote(quoteId,index);
      } else {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'warning',
          item: quoteId,
          message: i18n.t(
            'Once a quote is added, the current items in the basket will be removed. Are you Sure?'
          ),
          action1: { label: i18n.t('Cancel'), action: 'close' },
          action2: {
            label: i18n.t('Yes Please'),
            action: async () => {
              this.$bus.$emit('notification-progress-start', 'Processing ... ');
              this.addQuote(quoteId,index);
            }
          },
          hasNoTimeout: true
        });
      }
    }
  }
};
</script>

<style>
.outer_border {
  border: 1px solid #cccccc;
  border-radius: 15px;
  background-color: #fff;
}
.heading {
  text-align: center;
  font-size: 28px;
  font-family: oblik;
  background-color: #071a44;
  color: #fff;
  padding: 8px;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
}
.heading.otherQuoteHeading {
  background-color: #29275b;
}
.botom-space {
  padding-bottom: 45px !important;
}
.quoter-container:last-child .row.p20.botom-space {
  padding-bottom: 20px !important;
}
.text {
  font-size: 30px;
  font-family: oblik;
  padding: 26px;
  color: #4f4f4f;
}
.new_quote {
  padding: 24px 25px 30px 30px;
  border-bottom: 1px solid #cccccc;
}
.right-align {
  text-align: end !important;
}
.text_one {
  font-weight: bold;
  color: #4f4f4f;
  font-size: 18px;
  font-family: "Oblik";
}
.clr {
  color: #00a897;
}
.txr {
  text-align: right;
}
.txr1 {
  font-weight: normal;
  font-size: 18px;
  font-family: Arial;
}
body {
  font-family: "Open Sans", sans-serif;
  line-height: 1.25;
}

table {
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  width: 100%;
}

table caption {
  font-size: 1.5em;
  margin: 0.5em 0 0.75em;
}

table tr {
  padding: 0.35em;
}

table th,
table td {
  padding: 0.625em;
  color: #4f4f4f;
  font-family: Arial;
}

table th {
  font-size: 18px;
  font-family: oblik;
  text-align: left;
  color: #4f4f4f;
}
@media screen and (max-width: 600px) {
  table {
    border: 0;
  }

  table caption {
    font-size: 1.3em;
  }
  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
  table tr {
    display: block;
    margin-bottom: 0.625em;
  }
  table td {
    display: block;
    font-size: 0.8em;
    text-align: right;
  }
  table td::before {
    /*
* aria-label has no advantage, it won't be read inside a table
content: attr(aria-label);
*/
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }
}

@media screen and (max-width: 767px) {
  .quote-back-button .button_left {
    max-width: 100%;
    margin-bottom: 10px;
  }
  .qoute-addtocart-button .button_right {
    max-width: 100% !important;
    min-width: 100% !important;
  }
}
.left {
  text-align: left;
  color: #4f4f4f;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.new_quote1 {
  padding: 24px 19px 15px 30px;
  border-bottom: 1px solid #cccccc;
}
.align_right {
  text-align: right;
  font-family: Arial;
}
.p_right {
  padding-right: 28px;
  color: #4f4f4f;
  border-bottom: 1px solid #cccccc;
}
.bold {
  font-weight: bold;
  font-family: "Oblik";
}
.button_right {
  background-color: #29275b;
  border-radius: 3px;
  max-width: 284px;
  text-transform: uppercase;
  font-family: Arial !important;
  padding: 14.5px 0px !important;
}
.f_right {
  float: right;
}
.button_left {
  background-color: #b7b4b4;
  border-radius: 3px;
  max-width: 102px;
  font-family: Arial !important;
  padding: 14px 0px !important;
}
.back-button {
  float: left;
  text-align: center;
}
.f_right_vieworder {
  text-align: center;
}
.quote-image {
  width: 40px;
  margin: 0;
}
</style>
