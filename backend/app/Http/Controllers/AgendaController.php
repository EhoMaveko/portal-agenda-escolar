<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Agenda;
use Illuminate\Support\Facades\Storage;

class AgendaController extends Controller
{
    public function index(Request $request)
    {
        $consulta = Agenda::query();

        if ($request->has('perfil_id')) {
            $consulta->where('perfil_id', $request->perfil_id);
        }

        return response()->json($consulta->get());
    }


    public function store(Request $request)
    {
    $dados = $request->validate([
        'perfil_id' => 'required|exists:perfis,id',
        'titulo' => 'required|string|max:255',
        'descricao' => 'nullable|string',
        'data_evento' => 'required|date',
        'status' => 'required|string',
    ]);

    $agenda = Agenda::create($dados);

    return response()->json($agenda, 201);
    }

    public function destroy(int $id)
    {
        $agenda = Agenda::with('respostas')->findOrFail($id);

        foreach ($agenda->respostas as $resposta) {
            if ($resposta->arquivo_path) {
                Storage::disk('s3')->delete($resposta->arquivo_path);
            }
        }

        $agenda->delete();

        return response()->noContent();
    }

}
