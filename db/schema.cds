using {
    cuid,
    managed
} from '@sap/cds/common';

namespace inventory.db.schema;

entity Fornecedor : cuid, managed {
    nome : String;
}

entity Categoria : cuid, managed {
    nome : String;
}

entity Marca : cuid, managed {
    nome : String;
}

entity Produto : cuid, managed {
    nome           : String;
    marca          : Association to one Marca;
    categoria      : Association to many Categoria;
    qtd_em_estoque : Integer default 0;
    preco_medio    : Decimal default 0.00;
}

entity Compra : cuid, managed {
    Items       : Composition of many ItemCompra
                      on Items.compra = $self;
    valor_total : Decimal;
    fornecedor  : Association to one Fornecedor;
}

entity ItemCompra : cuid {
    key compra  : Association to Compra;
        produto : Association to Produto;
        qtd     : Integer;
        preco   : Decimal; //> materialized calculated field
};

entity ItemVenda : cuid, managed {
    key venda  : Association to Venda;
        produto : Association to Produto;
        qtd     : Integer;
        preco   : Decimal; //> materialized calculated field
}

entity Venda : cuid, managed {
       Items       : Composition of many ItemVenda
                      on Items.venda = $self;
    valor_total : Decimal;
}
