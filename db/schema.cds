using { cuid, managed } from '@sap/cds/common';
namespace inventory.db.schema;

entity Fornecedor : cuid, managed {
    nome: String;
}

entity Categoria : cuid, managed {
    nome: String;
}

entity Marca : cuid, managed {
    nome : String;
}

entity Produto : cuid, managed {
    nome: String;
    marca : Association to one Marca;
    categoria: Association to many Categoria;
    qtd_em_estoque: Integer default 0;
    preco_medio: Decimal default 0.00;
}

entity Compra : cuid, managed {
    item_compra : Association to many ItemCompra;
    valor_total : Decimal(1);
    fornecedor : Association to one Fornecedor;
}

entity ItemCompra : cuid, managed {
    produto : Association to one Produto;
    qtd_produto : Integer;
    valor_unitario: Decimal;
}
entity ItemVenda : cuid, managed {
    produto : Association to one Produto;
    qtd_produto : Integer;
    valor_unitario: Decimal;
}

entity Venda : cuid, managed {
    item_venda : Association to many ItemVenda;
    valor_total: Decimal;
}