// Modelo Cliente
class Cliente {
  constructor({ razaoSocial, cnpj, email, telefone, consultoria, status }) {
    this.razaoSocial = razaoSocial;
    this.cnpj = cnpj;
    this.email = email;
    this.telefone = telefone;
    this.consultoria = consultoria;
    this.status = status || 'NOVO';
    this.id = Date.now().toString(); // Simples ID
  }
}

module.exports = Cliente;
