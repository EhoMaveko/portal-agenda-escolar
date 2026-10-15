<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
use App\Models\Resposta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RespostaController extends Controller
{
    public function index(Request $request, $Id)
    {
        $agenda = Agenda::findOrFail($Id);
        $respostas = $agenda->respostas;

        return response()->json($respostas);
    }

    public function store(Request $request, $id)
    {
        $dados = $request->validate([
            'aluno_nome' => 'required|string|max:255',
            'comentario' => 'nullable|string',
            'arquivo' => 'nullable|file|max:10240',
        ]);

        $agenda = Agenda::findOrFail($id);

        $arquivoPath = null;

        if ($request->hasFile('arquivo')) {
            $arquivoPath = $request->file('arquivo')
                ->store('respostas', 's3');
        }

        $resposta = Resposta::create([
            'agenda_id' => $agenda->id,
            'aluno_nome' => $dados['aluno_nome'],
            'comentario' => $dados['comentario'] ?? null,
            'arquivo_path' => $arquivoPath,
        ]);

        return response()->json($resposta, 201);
    }
}
