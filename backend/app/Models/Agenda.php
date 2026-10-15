<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Agenda extends Model
{
    protected $fillable = [
        'perfil_id',
        'titulo',
        'descricao',
        'data_evento',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'data_evento' => 'datetime',
        ];
    }

    public function perfil(): BelongsTo
    {
        return $this->belongsTo(Perfil::class);
    }

    public function respostas(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
    return $this->hasMany(Resposta::class);
    }

}
