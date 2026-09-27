<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gold_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('karat')->unique();
            $table->decimal('milyem', 5, 3)->default(0);
            $table->timestamps();
        });

        DB::table('gold_settings')->insert([
            ['karat' => 14, 'milyem' => 0.800],
            ['karat' => 18, 'milyem' => 0.900],
            ['karat' => 22, 'milyem' => 0.940],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gold_settings');
    }
};
