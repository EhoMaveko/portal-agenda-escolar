<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AgendaController;
use App\Http\Controllers\RespostaController;
use App\Http\Controllers\RelatorioController;
use App\Models\Perfil;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/perfis', function () {
    return response()->json(
        Perfil::query()->orderBy('nome')->get()
    );
});

Route::get(
    '/relatorios/resumo-dsa/{id}',
    [RelatorioController::class, 'consultarResumoDsa']
);
Route::get(
    '/relatorios/resumo-dsa/{id}/download',
    [RelatorioController::class, 'baixarResumoDsa']
);


Route::get('/agendas', [AgendaController::class, 'index']);
Route::post('/agendas', [AgendaController::class, 'store']);
Route::delete('/agendas/{id}', [AgendaController::class, 'destroy']);
Route::post('/agendas/{id}/respostas', [RespostaController::class, 'store']);
Route::get('/agendas/{id}/respostas', [RespostaController::class, 'index']);
Route::post('/relatorios/solicitar-resumo-dsa', [RelatorioController::class, 'solicitarResumoDsa']);

