import axios from 'axios';
import { BASE_URL } from './constants';

export const fetchAutocomplete = () => axios.get(`${BASE_URL}/autocomplete`).then(res => res.data);

