var x = 0, y = 1;
var maxIndex = 4;
var deck = [];
var cardsInPlay = [];
var iterationCount = 0;

function toggleSorted() {
    var button = $("#flag");
    button.toggleClass("sorted").toggleClass("notsorted");
    if (sortedFlagTrue()) {
        button.text("Sorted? True");
    } else {
        button.text("Sorted? False");
    }
}

function sortedFlagTrue() {
    return $("#flag").hasClass("sorted");
}

function checkSortedFlag() {
    highlightCode(2);
    $("#text").html("We finished iteration " + iterationCount + "!<br/>Is the sorted flag set to true?");
    setYesNoFunctions(doneSorting, startIteration);
    $(".yesNoButtons").show();
    $(".next").hide();
}

function highlightCode(lineNumber) {
    $("code").removeClass("running").filter(".code" + lineNumber).addClass("running");
}

function doneSorting() {
    highlightCode(15);
    $("#text").html("Congratulations!<br/>The cards were sorted in " + iterationCount + " iterations!");
    $("#flag").off("click");
    $(".next").hide();
    $(".yesNoButtons").hide();
}

function setNextFunction(nextFunction) {
    $(".next").off("click").on("click", nextFunction);
}

function setYesNoFunctions(yesFunction, noFunction) {
    $("#yes").off("click").on("click", yesFunction);
    $("#no").off("click").on("click", noFunction);
}

function startIteration() {
    iterationCount++;
    highlightCode(3);
    if (iterationCount == 1) {
        $("#text").html("Let's sort these cards!<br/>Click the sorted flag to set it to true and click next");
    } else {
        $("#text").html("Then we have to keep going!<br/>Click the sorted flag to set it back to true, then click next to iterate again");
        $(".yesNoButtons").hide();
        $(".next").show();
    }
    x = 0;
    y = 1;
    setNextFunction(selectCards);
}

function highlightImage() {
    $(this).addClass("highlight");
}

function selectCards() {
    highlightCode(5);
    $("#text").html("Select cards " + x + " and " + y + "<br/>and click next");
    $("img").on("click", highlightImage);
    setNextFunction(checkOrder);
}

function checkOrder() {
    highlightCode(7);
    $("#text").html("Are these two cards already in order?");
    setYesNoFunctions(checkIfMorePairs, outOfOrder);
    $(".yesNoButtons").show();
    $(".next").hide();
    $("img").off("click", highlightImage);
}

function checkIfMorePairs() {
    $("img").removeClass("highlight");
    $(".yesNoButtons").hide();
    $(".next").show();
    if (y == maxIndex) {
        checkSortedFlag();
    } else {
        x++;
        y++;
        selectCards();
    }
}

function outOfOrder() {
    highlightCode(8);
    $("#text").html("Move card " + x + " to the copy area<br/>and click next");
    $(".yesNoButtons").hide();
    $(".next").show();
    setNextFunction(moveCardY);
}

function moveCardY() {
    highlightCode(9);
    $("#text").html("Move card " + y + " to position " + x + "<br/>and click next");
    setNextFunction(moveFromCopy);
}

function moveFromCopy() {
    highlightCode(10);
    $("#text").html("Move the card from the copy area to position " + y + " and click next");
    setNextFunction(toggleFlag);
}

function toggleFlag() {
    highlightCode(11);
    if (sortedFlagTrue()) {
        $("#text").html("We had to swap cards 😥<br/>Click the sorted flag to set it to false, then click next");
    } else {
        $("#text").html("We had to swap cards 😥<br/>The sorted flag is already false, so just click next");
    }
    setNextFunction(checkIfMorePairs);
}

$(init);

function init() {
    $("#flag").click(toggleSorted);

    $("#faqButton").click(openModal);

    $("#close").click(function(e) {
        // Stop the "close" anchor tag from linking
        e.preventDefault();
        // Close the popup
        closeModal();
    });

    initDeck();
    drawFive();
    displayCards();
    startIteration();
}

function displayCards() {
    var gameTable = $("#playArea");

    for (var i = 0; i < cardsInPlay.length; i++) {
        var aCard = cardsInPlay[i];
        var aCardImg = $("<img>").addClass("card").attr("src", aCard.imageFile).attr("alt", aCard.getFriendlyName());
        gameTable.prepend(aCardImg);
    }

    $(".card").draggable({
        cursor: "move",
        grid: [20, 20]
    });
}

function drawFive() {
    drawcards: while (cardsInPlay.length < 5) {
        var card = deck.pop();

        // Ensure no card with same
        // face value already in play
        for (var i = 0; i < cardsInPlay.length; i++) {
            var cardInPlay = cardsInPlay[i];
            if (cardInPlay.faceValue == card.faceValue) {
                continue drawcards;
            }
        }

        cardsInPlay.push(card);
    }
}

function initDeck() {

    for (var face = 2; face <= 14; face++) {
        var faceAbbrev, faceFriendlyName;

        switch (face) {
            case 14:
                // Ace is given the highest number
                // for ranking/comparing
                faceAbbrev = "A";
                faceFriendlyName = "Ace";
                break;
            case 11:
                faceAbbrev = "J";
                faceFriendlyName = "Jack";
                break;
            case 12:
                faceAbbrev = "Q";
                faceFriendlyName = "Queen";
                break;
            case 13:
                faceAbbrev = "K";
                faceFriendlyName = "King";
                break;
            case 14:
                faceAbbrev = "A";
                faceFriendlyName = "Ace";
                break;
            default:
                // 3 can just be "3", for example
                faceAbbrev = face.toString();
                faceFriendlyName = faceAbbrev;
        }

        for (var suit = 1; suit <= 4; suit++) {
            var suitAbbrev, suitFriendlyName;
            switch (suit) {
                case 1:
                    suitAbbrev = "C";
                    suitFriendlyName = "Clubs";
                    break;
                case 2:
                    suitAbbrev = "H";
                    suitFriendlyName = "Hearts";
                    break;
                case 3:
                    suitAbbrev = "D";
                    suitFriendlyName = "Diamonds";
                    break;
                case 4:
                    suitAbbrev = "S";
                    suitFriendlyName = "Spades";
                    break;
            }

            // Create card object
            var card = {
                faceValue: face,
                faceAbbrev: faceAbbrev,
                faceFriendlyName: faceFriendlyName,
                suitValue: suit,
                suitAbbrev: suitAbbrev,
                suitFriendlyName: suitFriendlyName,
                imageFile: "img/" + faceAbbrev + suitAbbrev + ".png",
                compareTo: function (anotherCard) {
                    if (this.faceValue > anotherCard.faceValue) {
                        return 1;
                    }
                    if (this.faceValue < anotherCard.faceValue) {
                        return -1;
                    }
                    return 0;
                },
                getFriendlyName: function () {
                    return this.faceFriendlyName + " of " + suitFriendlyName;
                }
            };

            deck.push(card);

        }

        shuffle(deck);
    }
}

// From https://javascript.info/task/shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

        // swap elements array[i] and array[j]
        // we use "destructuring assignment" syntax to achieve that
        // you'll find more details about that syntax in later chapters
        // same can be written as:
        // let t = array[i]; array[i] = array[j]; array[j] = t
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function center() {
    // Get the distance from the edge of the window to its center
    var top = Math.max($(window).height() - $("#faq").outerHeight(), 0) / 2;
    var left = Math.max($(window).width() - $("#faq").outerWidth(), 0) / 2;

    // Position the modal window using absolute positioning
    $("#faq").css("top", top + $(window).scrollTop());
    $("#faq").css("left", left + $(window).scrollLeft());
}

function closeModal() {
    $("#faq").hide();
    $("#overlay").hide();
    // The browser can stop resizing the modal now
    $(window).off("resize.faq");
}

function openModal() {
    $("#faq").show();
    $("#overlay").show();

    // Center the popup
    center();

    // Tell the window (browser) to re-center the popup when it is resized
    $(window).on("resize.faq", center);
}