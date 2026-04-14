<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_session_id',
        'question',
        'choices',
        'correct_index',
        'user_answer_index',
        'is_correct',
        'explanation',
    ];

    protected $casts = [
        'choices' => 'array',
        'is_correct' => 'boolean',
    ];

    public function session()
    {
        return $this->belongsTo(QuizSession::class, 'quiz_session_id');
    }
}
