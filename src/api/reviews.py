from flask import  request, jsonify
from models import Review
from math import ceil

# Ruta para obtener reseñas con paginación
@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    page = int(request.args.get('page', 1))
    page_size = 10  # Tamaño de la página
    reviews_query = Review.query.paginate(page, page_size, False)

    reviews = [review.to_dict() for review in reviews_query.items]
    return jsonify({
        "reviews": reviews,
        "page": page,
        "total_pages": ceil(reviews_query.total / page_size)
    })

# Ruta para crear una nueva reseña
@app.route('/api/reviews', methods=['POST'])
def create_review():
    data = request.json
    new_review = Review(
        game_id=data['game_id'],
        username=data['username'],
        comment=data['comment']
    )
    db.session.add(new_review)
    db.session.commit()

    return jsonify(new_review.to_dict()), 201