const axios = require("axios");

class CrnService  {
  #base_url = 'http://api.nossosmedicos.com.br/api';

  async validate(crn, subscription) {
    try {
      const response = await axios({
        url: `${this.#base_url}/nutricionista/${subscription}/CRN${crn}`,
        method: 'GET',
      });
      
      const { data } = response;

      return data.sucesso;
    } catch (error) {
      throw error('Erro interno da API de consulta de CRN!');
    }
  }
}

module.exports = new CrnService();