export function Footer() {
  return (
    <footer className="border-t border-[#e2d5c3] pt-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="uppercase tracking-[0.4em] text-xs text-muted-foreground">Maison Fourneaux</p>
          <p className="mt-3 text-sm text-[#6b5a45]">
            12 rue des Meuniers, Lyon — Ouvert du mercredi au dimanche.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-deep">
          <a href="#">Instagram</a>
          <a href="#">Newsletter</a>
          <a href="#">Mentions légales</a>
        </div>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Atelier fictif. Tous droits réservés.
      </p>
    </footer>
  );
}

