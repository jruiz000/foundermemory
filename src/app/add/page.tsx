import { AddQuoteForm } from "@/components/add-quote-form";

export default function AddPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4 text-zinc-100">
          Share Founder Wisdom
        </h1>
        <p className="text-zinc-400">
          Add a quote that helped you. Help another founder find it when they need it.
        </p>
      </div>

      <AddQuoteForm />
    </div>
  );
}