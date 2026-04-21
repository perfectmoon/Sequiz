<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('levels', function (Blueprint $table) {
            $table->id();
            $table->integer('level_number')->unique();
            $table->string('title');
            $table->text('description');
            $table->enum('difficulty', ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard']);
            $table->string('category');
            $table->json('initial_data')->nullable();
            $table->enum('validation_type', ['exact', 'regex', 'custom'])->default('exact');
            $table->text('expected_answer');
            $table->integer('points_awarded')->default(100);
            $table->string('time_estimate');
            $table->integer('next_level')->nullable();
            $table->json('resources')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('levels');
    }
};
