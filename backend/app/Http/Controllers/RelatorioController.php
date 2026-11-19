<?php
namespace App\Http\Controllers;

use App\Jobs\GerarResumoDsa;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RelatorioController extends Controller
{
    public function solicitarResumoDsa()
    {
        $id = (string) Str::uuid();

        Cache::put("relatorio:{$id}", [
            'status' => 'aguardando',
        ], now()->addMinutes(30));

        GerarResumoDsa::dispatch($id);

        return response()->json([
            'mensagem' => 'Relatório solicitado com sucesso.',
            'id' => $id,
        ], 202);
    }

    public function consultarResumoDsa(string $id)
    {
        $relatorio = Cache::get("relatorio:{$id}");

        if (!$relatorio) {
            return response()->json([
                'erro' => 'Relatório não encontrado ou expirado.'
            ], 404);
        }

        if ($relatorio['status'] !== 'concluido') {
            return response()->json([
                'status' => $relatorio['status']
            ]);
        }

        return response()->json([
            'status' => 'concluido',
        ]);
    }

    public function baixarResumoDsa(string $id)
    {
        $relatorio = Cache::get("relatorio:{$id}");

        if (!$relatorio || $relatorio['status'] !== 'concluido') {
            return response()->json([
                'erro' => 'Relatório não encontrado, expirado ou ainda não concluído.'
            ], 404);
        }

        return Storage::disk('s3')->download(
            $relatorio['caminho'],
            'resumo-dsa.txt',
            ['Content-Type' => 'text/plain; charset=UTF-8']
        );
    }
}
