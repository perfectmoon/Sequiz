<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('quiz_session_id')
                ->constrained('quiz_sessions')
                ->cascadeOnDelete();

            $table->text('question');

            $table->json('choices');

            $table->unsignedTinyInteger('correct_index');

            $table->unsignedTinyInteger('user_answer_index')->nullable();
            $table->boolean('is_correct')->default(false);

            $table->text('explanation')->nullable();

            $table->timestamps();

            $table->index('quiz_session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};
