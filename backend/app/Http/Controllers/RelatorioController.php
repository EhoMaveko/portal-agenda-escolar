<?php

namespace App\Http\Controllers;

use App\Jobs\GerarResumoDsa;

class RelatorioController extends Controller
{
    public function solicitarResumoDsa()
    {
        GerarResumoDsa::dispatch();

        return response()->json([
            'mensagem' => 'Solicitação de resumo enviada para processamento.'
        ], 202);
    }
}
