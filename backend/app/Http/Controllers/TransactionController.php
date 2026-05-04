<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        return Transaction::latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'amount' => 'required|numeric',
            'type' => 'required|in:income,expense'
        ]);

        return Transaction::create($request->all());
    }

    public function destroy($id)
    {
        Transaction::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function summary()
    {
        $income = Transaction::where('type', 'income')->sum('amount');
        $expense = Transaction::where('type', 'expense')->sum('amount');
        
        return [
            'income' => (float)$income,
            'expense' => (float)$expense,
            'balance' => (float)($income - $expense)
        ];
    }
}
