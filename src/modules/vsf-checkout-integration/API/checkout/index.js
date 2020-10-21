import { apiStatus } from '../../../lib/util';
import { Router } from 'express';
import axios from 'axios';

module.exports = ({ config, db }) => {
  let api = Router();
  api.get('/get-token', (req, res) => {
  });

  api.post('/do-payment', (req, res) => {
  })

  return api
}
