• Afficher le nombre de produits par catégorie.
• Afficher les catégories ayant au moins 5 produits.
• Calculer la moyenne des prix des produits pour chaque catégorie.
• Afficher les catégories où la moyenne des prix des produits est supérieure à 100.
• Identifier les produits en rupture de stock (stock = 0).
SELECT c.nom AS categorieNom, COUNT(p.id) AS nombreProduits 
FROM categories c
LEFT JOIN produits p ON c.id = p.categorieId 
GROUP BY c.nom;

SELECT c.nom AS categorieNom 
FROM categories c
LEFT JOIN produits p ON c.id = p.categorieId 
GROUP BY c.nom 
HAVING COUNT(p.id) >= 5;

SELECT c.nom AS categorieNom, AVG(p.prix) AS prixMoyen 
FROM categories c
LEFT JOIN produits p ON c.id = p.categorieId 
GROUP BY c.nom;

SELECT c.nom AS categorieNom, AVG(p.prix) AS prixMoyen 
FROM categories c
LEFT JOIN produits p ON c.id = p.categorieId 
GROUP BY c.nom 
HAVING AVG(p.prix) > 100;

SELECT * 
FROM produits 
WHERE stock = 0;
