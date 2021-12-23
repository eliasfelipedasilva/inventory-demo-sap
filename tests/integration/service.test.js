const cds = require('@sap/cds/lib')
const { GET, expect } = cds.test (__dirname+'../../../')


describe('OData Protocol', () => {


  it('serves $metadata documents in v4', async () => {
    const { headers, status, data } = await GET `/inventory/$metadata`
    console.log(headers, status, data)
    expect(status).to.equal(200)
  })



  it('supports $select', async () => {
    const { data } = await GET(`/inventory/Fornecedor`, {
      params: { $select: `ID,nome` },
    })
    expect(data.value).to.eql([
      { ID: "83d6d092-4f2d-4302-9f5a-851289932904", nome: 'Atacado Ourinhos' }
    ])
  })

  it('supports $expand', async () => {
    const { data } = await GET(`/inventory/Produto`, {
      params: {
        $select: `nome`,
        $expand: `marca($select=nome)`,
      },
    })
    expect(data.value).to.containSubset([
      { nome: 'Camiseta Fit', marca: { nome: 'Adidas' }}
    ])
  })

  it('supports $value requests', async () => {
    const { data } = await GET`/inventory/Produto/565850d1-e679-4e13-8e28-c700be3a5a97/qtd_em_estoque/$value`
    expect(data).to.equal(0)
  })

})