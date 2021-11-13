const cds = require('@sap/cds');

const {Fornecedor, Categoria, Marca, Produto, Compra, ItemCompra, ItemVenda, Venda} = cds.entities('inventory.db.schema');

module.exports = class  inventoryService extends cds.ApplicationService {
    async init(){
        this.after(['CREATE', 'UPDATE'], 'Compra', this.ajustar_valores_calculados);
        await super.init();
    }

    async ajustar_valores_calculados(req){

        //sempre buscar os items da compra separado da requisicao para quando nao vier os dados de items
        // realizar os calculos da mesma forma !!
        const items = await SELECT.from(ItemCompra).where({"compra_ID": req.ID})

        // inicio funcoes de calculos
        const total_compra = await this.calcular_valor_total_compra(items);
        const aQtd_estoque_produtos = await this.calcular_qtd_estoque(items);

        //separando lista de produtos que serão atualizados
        let listaProdutosAtualizados = aQtd_estoque_produtos.map((item)=>{return item.produto_ID})

        const aPrecoMedioPodutos = await this.calcular_preco_medio(listaProdutosAtualizados)
        // console.log( aPrecoMedioPodutos) // depois de pegar todos os valores atualizar no banco 
        //fim funcoes de calculos

        const infos_produtos = await this.juntar_arrays_resultante([aQtd_estoque_produtos,aPrecoMedioPodutos])

        // inicio atualizacoes em tabelas
       const oCompra = await UPDATE.entity(Compra).with({valor_total : total_compra}).where({"ID" : req.ID}); 

       //implementar atualizacao de produtos com adicao dos estoques em funcao separada

       //fim atualizacoes e tabelas

        return;
    }

    async calcular_valor_total_compra(items){
        let total_compra=0.00;
        items.map((item) =>{
            total_compra = total_compra +  (item.qtd * item.preco)
        });
        return total_compra;
    }

    async calcular_qtd_estoque(itemsCompra){
        const lista_distinta_produtos = [...new Set(itemsCompra.map(item => item.produto_ID))];
        let aEstoquePodutos = [];
        
        lista_distinta_produtos.map((item_id_produto)=>{
            let lista_de_items_do_produto =    itemsCompra.filter((item) =>{
                if(item_id_produto === item.produto_ID)
                return true;
            });

            let adiconar_estoque_produto = 0;
            lista_de_items_do_produto.map((item)=>{
                 adiconar_estoque_produto = adiconar_estoque_produto+  item.qtd
            })
            aEstoquePodutos.push({
                produto_ID : item_id_produto,
                adiconar_estoque_produto
            })
 
        });
        return aEstoquePodutos;

    }

    async calcular_preco_medio(listaProdutosAtualizados){
        // console.log(listaProdutosAtualizados)

        const lista_items = await SELECT.from('ItemCompra').where({"produto_ID" : listaProdutosAtualizados})

        const lista_distinta_produtos = [...new Set(lista_items.map(item => item.produto_ID))];
        let aPrecoMedioPodutos = [];
        
        lista_distinta_produtos.map((item_id_produto)=>{
            let lista_de_items_do_produto =    lista_items.filter((item) =>{
                if(item_id_produto === item.produto_ID)
                return true;
            });

            let total_qtd = 0;
            let valor_total = 0.00;
 
            lista_de_items_do_produto.map((item)=>{
                total_qtd = total_qtd +  item.qtd;
                valor_total = valor_total + (item.preco * item.qtd)
            })
         
            aPrecoMedioPodutos.push({
                produto_ID : item_id_produto,
                preco_medio : valor_total/total_qtd
            })
 
        });
        return aPrecoMedioPodutos;
    }

    // funcao criada para juntar valores de arrays, dessa forma n alteramos os arrays resultandes das outras funcoes
    async juntar_arrays_resultante(arrays){

        const mergePelaPropriedade = (arrayPrincipal, arraySecundario, prop) => {
            arraySecundario.forEach(arraySecundarioElemento => {
              let arrayPrincipalElemento = arrayPrincipal.find(arrayPrincipalElemento => {
                return arraySecundarioElemento[prop] === arrayPrincipalElemento[prop];
              })
              arrayPrincipalElemento ? Object.assign(arrayPrincipalElemento, arraySecundarioElemento) :
                                         arrayPrincipal.push(arraySecundarioElemento);
            })
          }

          var arrayPrincipal /* arr1 */ =arrays[0];
          for(let i = arrays.length; i-- ; i>0){
            var arraySecundario /* arr2 */ = arrays[i]
            mergePelaPropriedade(arrayPrincipal, arraySecundario, 'produto_ID');
          }
          return arrayPrincipal;

    }
}